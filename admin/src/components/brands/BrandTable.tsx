import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';
import { Brand } from '../../types/brand';
import useBrands from '../../hooks/useBrands';
import BrandFormModal from './BrandFormModal';

const COLUMNS = [
	{ label: 'Brand Name', key: 'name', sortable: true },
	{ label: 'Product Count', key: 'productCount', sortable: true },
	{ label: 'Added Date', key: 'createdAt', sortable: true },
	{ label: 'Last Updated', key: 'updatedAt', sortable: true },
	{ label: 'Actions', key: 'actions', sortable: false },
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

// Edit icon
const EditIcon = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<path
			d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

// Trash icon
const TrashIcon = () => (
	<svg
		width='16'
		height='16'
		viewBox='0 0 24 24'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<polyline
			points='3 6 5 6 21 6'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<path
			d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<path
			d='M10 11v6M14 11v6'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<path
			d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export default function BrandTable() {
	const {
		isLoading,
		error,
		filteredBrands,
		brands,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		removeBrand,
		addBrand,
		editBrand,
	} = useBrands();
	const toggleSort = (key: string) => {
		if (!['name', 'productCount', 'createdAt', 'updatedAt'].includes(key))
			return;
		const column = key as 'name' | 'productCount' | 'createdAt' | 'updatedAt';
		setSort((prev) => ({
			column,
			direction:
				prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	const [formTarget, setFormTarget] = useState<Brand | null | undefined>(
		undefined,
	);
	// undefined = modal closed, null = add mode, Product = edit mode
	const isFormOpen = formTarget !== undefined;

	const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleSave = async (payload: { name: string; slug: string }) => {
		if (formTarget) {
			await editBrand(formTarget.brandId, payload);
		} else {
			await addBrand({ ...payload });
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			await removeBrand(deleteTarget.brandId);
		} finally {
			setIsDeleting(false);
			setDeleteTarget(null);
		}
	};

	return (
		<>
			{/* Toolbar */}
			<div className='flex flex-col gap-3 mb-4'>
				{/* Search + Add button */}
				<div className='flex items-center gap-3'>
					<input
						type='text'
						placeholder='Search by name'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500'
					/>
					<Button size='sm' onClick={() => setFormTarget(null)}>
						+ Add Brand
					</Button>
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
								: filteredBrands.map((brand) => (
										<TableRow key={brand.brandId}>
											<TableCell className='px-5 py-4 sm:px-6 text-start'>
												<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
													{brand.name}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 text-start text-theme-sm'>
												<span className='inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'>
													{brand.productCount}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{new Date(brand.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{new Date(brand.updatedAt).toLocaleDateString()}
											</TableCell>
											<TableCell className='px-4 py-3 text-start'>
												<div className='flex items-center gap-2'>
													<button
														onClick={() => setFormTarget(brand)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
														title='Edit product'
													>
														<EditIcon />
													</button>
													<button
														onClick={() => setDeleteTarget(brand)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors'
														title='Delete product'
													>
														<TrashIcon />
													</button>
												</div>
											</TableCell>
										</TableRow>
									))}
							{!isLoading && filteredBrands.length === 0 && (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className='px-5 py-8 text-center text-gray-400 text-sm'
									>
										No brands found
									</td>
								</tr>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			{/* Add / Edit Modal */}
			<BrandFormModal
				isOpen={isFormOpen}
				onClose={() => setFormTarget(undefined)}
				onSave={handleSave}
				brand={formTarget ?? null}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				isOpen={!!deleteTarget}
				onClose={() => !isDeleting && setDeleteTarget(null)}
				className='max-w-md p-6 m-4'
				showCloseButton={false}
			>
				<div className='flex flex-col gap-4'>
					<div>
						<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-1'>
							Delete Brand
						</h4>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Are you sure you want to delete{' '}
							<span className='font-medium text-gray-700 dark:text-gray-300'>
								{deleteTarget?.name}
							</span>
							? This action cannot be undone.
						</p>
					</div>
					<div className='flex justify-end gap-3'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => setDeleteTarget(null)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<button
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className='inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm bg-error-500 text-white hover:bg-error-600 disabled:opacity-50 disabled:cursor-not-allowed transition'
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
