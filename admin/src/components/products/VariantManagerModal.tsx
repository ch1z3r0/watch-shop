import { useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';
import VariantFormModal from './VariantFormModal';
import { Product, Variant } from '../../types/product';

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = () => (
	<svg
		width='14'
		height='14'
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

const TrashIcon = () => (
	<svg
		width='14'
		height='14'
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariantManagerModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: Product | null;
	onCreateVariant: (
		productId: string,
		payload: Omit<Variant, 'variantId'>,
	) => Promise<void>;
	onEditVariant: (
		productId: string,
		variantId: string,
		payload: Omit<Variant, 'variantId'>,
	) => Promise<void>;
	onRemoveVariant: (productId: string, variantId: string) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VariantManagerModal({
	isOpen,
	onClose,
	product,
	onCreateVariant,
	onEditVariant,
	onRemoveVariant,
}: VariantManagerModalProps) {
	const [formTarget, setFormTarget] = useState<Variant | null | undefined>(
		undefined,
	);
	// undefined = form closed, null = add mode, Variant = edit mode
	const isFormOpen = formTarget !== undefined;

	const [deleteTarget, setDeleteTarget] = useState<Variant | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	if (!product) return null;

	const isLastVariant = product.variants.length === 1;

	const handleSave = async (payload: Omit<Variant, 'variantId'>) => {
		if (formTarget) {
			await onEditVariant(product.productId, formTarget.variantId, payload);
		} else {
			await onCreateVariant(product.productId, payload);
		}
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			await onRemoveVariant(product.productId, deleteTarget.variantId);
			setDeleteTarget(null);
		} finally {
			setIsDeleting(false);
		}
	};

	const fmt = (n: number) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(n);

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				className='max-w-2xl w-full m-4 p-6'
				showCloseButton={true}
			>
				<div className='flex flex-col gap-5'>
					{/* Header */}
					<div className='flex items-start flex-col gap-3'>
						<div>
							<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
								Variants
							</h4>
							<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
								{product.name} — {product.variants.length} variant
								{product.variants.length !== 1 ? 's' : ''}
							</p>
						</div>
						<Button size='sm' onClick={() => setFormTarget(null)}>
							+ Add Variant
						</Button>
					</div>

					{/* Variant Table */}
					<div className='overflow-x-auto rounded-xl border border-gray-100 dark:border-white/[0.05]'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-gray-100 dark:border-white/[0.05]'>
									{['Color', 'Case', 'Size', 'Price', 'Stock', 'Actions'].map(
										(col) => (
											<th
												key={col}
												className='px-4 py-3 text-left font-medium text-gray-500 text-xs dark:text-gray-400'
											>
												{col}
											</th>
										),
									)}
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
								{product.variants.map((variant) => (
									<tr key={variant.variantId}>
										<td className='px-4 py-3 font-medium text-gray-800 dark:text-white/90'>
											{variant.color}
										</td>
										<td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
											{variant.case || '—'}
										</td>
										<td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
											{variant.size}mm
										</td>
										<td className='px-4 py-3 text-gray-500 dark:text-gray-400'>
											{fmt(variant.price)}
										</td>
										<td className='px-4 py-3'>
											<Badge
												size='sm'
												color={
													variant.stock === 0
														? 'error'
														: variant.stock < 10
															? 'warning'
															: 'success'
												}
											>
												{variant.stock} units
											</Badge>
										</td>
										<td className='px-4 py-3'>
											<div className='flex items-center gap-2'>
												<button
													onClick={() => setFormTarget(variant)}
													className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
													title='Edit variant'
												>
													<EditIcon />
												</button>
												<button
													onClick={() => setDeleteTarget(variant)}
													disabled={isLastVariant}
													className='p-1.5 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
													title={
														isLastVariant
															? 'Cannot delete the only variant'
															: 'Delete variant'
													}
												>
													<TrashIcon />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</Modal>

			{/* Add / Edit Variant Form */}
			<VariantFormModal
				isOpen={isFormOpen}
				onClose={() => setFormTarget(undefined)}
				onSave={handleSave}
				variant={formTarget ?? null}
			/>

			{/* Delete Confirmation */}
			<Modal
				isOpen={!!deleteTarget}
				onClose={() => !isDeleting && setDeleteTarget(null)}
				className='max-w-sm p-6 m-4'
				showCloseButton={false}
			>
				<div className='flex flex-col gap-4'>
					<div>
						<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-1'>
							Delete Variant
						</h4>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Are you sure you want to delete the{' '}
							<span className='font-medium text-gray-700 dark:text-gray-300'>
								{deleteTarget?.color} {deleteTarget?.size}mm
							</span>{' '}
							variant? This cannot be undone.
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
