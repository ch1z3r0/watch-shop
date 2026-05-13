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
import { Modal } from '../ui/modal';
import useProducts, {
	getTotalStock,
	getPriceRange,
} from '../../hooks/useProducts';
import { Product, Variant } from '../../types/product';
import ProductFormModal from './ProductFormModal';
import VariantManagerModal from './VariantManagerModal';

const COLUMNS = [
	'Product Name',
	'Brand',
	'Category',
	'Variants',
	'Stock',
	'Price Range',
	'Actions',
];

function SkeletonRow() {
	return (
		<TableRow>
			{COLUMNS.map((col) => (
				<TableCell key={col} className='px-4 py-3'>
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
const LayersIcon = () => (
	<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
		<polygon
			points='12 2 2 7 12 12 22 7 12 2'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<polyline
			points='2 17 12 22 22 17'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<polyline
			points='2 12 12 17 22 12'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

export default function ProductTable() {
	const {
		products,
		isLoading,
		error,
		brandMap,
		brands,
		categories,
		categoryMap,
		removeProduct,
		addProduct,
		editProduct,
		createVariant,
		editVariant,
		removeVariant,
	} = useProducts();

	const [formTarget, setFormTarget] = useState<Product | null | undefined>(
		undefined,
	);
	// undefined = modal closed, null = add mode, Product = edit mode
	const isFormOpen = formTarget !== undefined;

	const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const [variantTarget, setVariantTarget] = useState<Product | null>(null);

	const handleSave = async (
		payload: {
			name: string;
			slug: string;
			brandId: string;
			categoryId: string;
		},
		variant?: Omit<Variant, 'variantId'>,
	) => {
		if (formTarget) {
			await editProduct(formTarget.productId, payload);
		} else {
			await addProduct({ ...payload, variants: [variant!] });
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			await removeProduct(deleteTarget.productId);
		} finally {
			setIsDeleting(false);
			setDeleteTarget(null);
		}
	};

	// Keep variantTarget in sync — variants change in products state after edits
	const syncedVariantTarget = variantTarget
		? (products.find((p) => p.productId === variantTarget.productId) ?? null)
		: null;
	if (error) {
		return (
			<Alert variant='error' title='Failed to load products' message={error} />
		);
	}
	return (
		<>
			{/* Toolbar */}
			<div className='flex justify-end mb-4'>
				<Button size='sm' onClick={() => setFormTarget(null)}>
					+ Add Product
				</Button>
			</div>
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
				<div className='max-w-full overflow-x-auto'>
					<Table>
						{/* Table Header */}
						<TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
							<TableRow>
								{COLUMNS.map((col) => (
									<TableCell
										key={col}
										isHeader
										className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
									>
										{col}
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
								: products.map((product) => (
										<TableRow key={product.productId}>
											<TableCell className='px-5 py-4 sm:px-6 text-start'>
												<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
													{product.name}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{brandMap[product.brandId] || product.brandId}
											</TableCell>
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{categoryMap[product.categoryId] || product.categoryId}
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
											<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
												{getPriceRange(product.variants ?? [])}
											</TableCell>
											<TableCell className='px-4 py-3 text-start'>
												<div className='flex items-center gap-2'>
													<button
														onClick={() => setFormTarget(product)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
														title='Edit product'
													>
														<EditIcon />
													</button>
													<button
														onClick={() => setDeleteTarget(product)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors'
														title='Delete product'
													>
														<TrashIcon />
													</button>
													<button
														onClick={() => setVariantTarget(product)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors'
														title='Manage variants'
													>
														<LayersIcon />
													</button>
												</div>
											</TableCell>
										</TableRow>
									))}
						</TableBody>
					</Table>
				</div>
			</div>
			{/* Add / Edit Modal */}
			<ProductFormModal
				isOpen={isFormOpen}
				onClose={() => setFormTarget(undefined)}
				onSave={handleSave}
				product={formTarget ?? null}
				brands={brands}
				categories={categories}
			/>
			<VariantManagerModal
				isOpen={!!variantTarget}
				onClose={() => setVariantTarget(null)}
				product={syncedVariantTarget}
				onCreateVariant={createVariant}
				onEditVariant={editVariant}
				onRemoveVariant={removeVariant}
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
							Delete Product
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
