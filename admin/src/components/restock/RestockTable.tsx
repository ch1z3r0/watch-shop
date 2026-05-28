import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';
import { FlatVariant } from '../../types/product';
import type { Filters } from '../../hooks/useRestock';
import useRestock from '../../hooks/useRestock';
import { ArrowRotateRight } from '../../icons';
import RestockModal from '../products/RestockModal';

const COLUMNS = [
	{ label: 'Product Name', key: 'productName', sortable: true },
	{ label: 'Variant', key: 'variant', sortable: false },
	{ label: 'Stock', key: 'stock', sortable: true },
	{ label: 'Restock', key: 'restock', sortable: false },
];

const STOCK_TABS: { label: string; value: Filters['stock'] }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Low Stock', value: 'lowstock' },
	{ label: 'Out of Stock', value: 'outofstock' },
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
		isLoading,
		error,
		filteredVariants,
		filters,
		setFilters,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		restockProductVariant,
	} = useRestock();

	const toggleSort = (key: string) => {
		if (!['productName', 'stock'].includes(key)) return;
		const column = key as 'productName' | 'stock';
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
		setRestockTarget(null);
	};

	return (
		<>
			{/* Toolbar */}
			<div className='flex flex-col gap-3 mb-4'>
				{/* Stock Status */}
				<div className='flex items-center gap-2 flex-wrap'>
					{STOCK_TABS.map((tab) => (
						<button
							key={tab.value}
							onClick={() => setFilters({ stock: tab.value })}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
								filters.stock === tab.value
									? 'bg-brand-500 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.08]'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				{/* Search */}
				<div className='flex items-center gap-3'>
					<input
						type='text'
						placeholder='Search by Product Name and Color'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500'
					/>
				</div>
			</div>
			{error && (
				<div className='mb-4 px-4 py-3 rounded-xl bg-error-50 border border-error-200 text-error-600 text-sm dark:bg-error-500/10 dark:border-error-500/20 dark:text-error-400'>
					{error}
				</div>
			)}
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
								: filteredVariants.map((product) => (
										<TableRow key={product.variantId}>
											<TableCell className='px-5 py-4 sm:px-6 text-start'>
												<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
													{product.productName}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{product.color} {product.size}mm{' '}
												{product.case ? `${product.case}` : ''}
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												<Badge
													size='sm'
													color={
														product.stock === 0
															? 'error'
															: product.stock < 10
																? 'warning'
																: 'success'
													}
												>
													{product.stock} units
												</Badge>
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
							{!isLoading && filteredVariants.length === 0 && (
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
