import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';
import Alert from '../ui/alert/Alert';
import Button from '../ui/button/Button';
import { getTotalStock } from '../../hooks/useProducts';
import { FlatVariant } from '../../types/product';
import type { Filters } from '../../hooks/useProducts';
import useRestock from '../../hooks/useRestock';
import { ArrowRotateRight } from '../../icons';

const COLUMNS = [
	{ label: 'Product Name', key: 'name', sortable: true },
	{ label: 'Variant', key: 'variant', sortable: false },
	{ label: 'Stock', key: 'stock', sortable: true },
	{ label: 'Restock', key: 'restock', sortable: false },
];

function SkeletonRow() {
	return (
		<TableRow>
			{COLUMNS.map((col) => (
				<TableCell key={col.key} className='px-4 py-3'>
					<div className='h-4 rounded bg-gray-100 dark:bg-white/[0.05] animate-pulse' />
				</TableCell>
			))}
		</TableRow>
	);
}

export default function RestockTable() {
	const {
		products,
		isLoading,
		error,
		filteredProducts,
		searchQuery,
		setSearchQuery,
		filters,
		setFilters,
		sort,
		setSort,
		restockProductVariant,
	} = useRestock();

	const toggleSort = (key: string) => {
		if (!['name', 'stock'].includes(key)) return;
		const column = key as 'name' | 'stock';
		setSort((prev) => ({
			column,
			direction:
				prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const [restockTarget, setRestockTarget] = useState<FlatVariant | null>(null);

	const handleRestock = async (quantity: number) => {
		if (!restockTarget) return;
		await restockProductVariant(
			restockTarget.productId,
			restockTarget.variantId,
			quantity,
		);
	};

	return (
		<>
			{/* Toolbar */}
			<div className='flex flex-col gap-3 mb-4'>
				{/* Search + Add button */}
				<div className='flex items-center gap-3'>
					<input
						type='text'
						placeholder='Search by name, brand, category, color, case, mode...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500'
					/>
					<Button size='sm' onClick={() => setRestockTarget(null)}>
						+ Add Product
					</Button>
				</div>

				{/* Filters */}
				<div className='flex items-center gap-3'>
					<select
						value={filters.stock}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								stock: e.target.value as Filters['stock'],
							}))
						}
						className='px-3 py-2 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500'
					>
						<option value='all'>All Stock</option>
						<option value='lowstock'>Low Stock</option>
						<option value='outofstock'>Out of Stock</option>
					</select>

					{/* Clear filters button — only shows when something is active */}
					{(searchQuery || filters.stock !== 'all') && (
						<button
							onClick={() => {
								setSearchQuery('');
								setFilters({ stock: 'all' });
							}}
							className='text-xs text-gray-400 hover:text-error-500 transition-colors'
						>
							Clear all
						</button>
					)}
				</div>
			</div>
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
				<div className='max-w-full overflow-x-auto'>
					<Table>
						{/* Table Header */}
						<TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
							<TableRow>
								{COLUMNS.map((col) => (
									<TableCell
										key={col.key}
										isHeader
										className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
									>
										<div
											className={`flex items-center gap-1 ${col.sortable ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300' : ''}`}
											onClick={() => col.sortable && toggleSort(col.key)}
										>
											{col.label}
											{col.sortable && (
												<span className='text-gray-300 dark:text-gray-600 pointer-events-none'>
													{sort.column === col.key
														? sort.direction === 'asc'
															? '↑'
															: '↓'
														: '↕'}
												</span>
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
							{isLoading
								? Array.from({ length: 5 }).map((_, i) => (
										<SkeletonRow key={i} />
									))
								: filteredProducts.map((product) => (
										<TableRow key={product.productId}>
											<TableCell className='px-5 py-4 sm:px-6 text-start'>
												<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
													{product.name}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{product.variants?.length || 0}
											</TableCell>
											<TableCell className='px-4 py-3 text-start text-theme-sm'>
												{(() => {
													const total = getTotalStock(product.variants ?? []);
													const color =
														total === 0
															? 'error'
															: total < 10
																? 'warning'
																: 'success';
													return (
														<Badge size='sm' color={color}>
															{total} units
														</Badge>
													);
												})()}
											</TableCell>
											<TableCell className='px-4 py-3 text-start'>
												<div className='flex items-center gap-2'>
													<button
														onClick={() => setRestockTarget(product)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
														title='Edit product'
													>
														<ArrowRotateRight />
													</button>
												</div>
											</TableCell>
										</TableRow>
									))}
							{!isLoading && filteredProducts.length === 0 && (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className='px-5 py-8 text-center text-gray-400 text-sm'
									>
										No products found
									</td>
								</tr>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			<RestockModal
				isOpen={!!restockTarget}
				onClose={() => setRestockTarget(null)}
				onRestock={handleRestock}
				variant={restockTarget}
			/>
		</>
	);
}
