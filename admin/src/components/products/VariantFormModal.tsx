import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Variant } from '../../types/product';
import ImageUploader from './ImageUploader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariantFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (payload: Omit<Variant, 'variantId'>) => Promise<void>;
	variant?: Variant | null;
}

type Draft = {
	color: string;
	size: string;
	stock: string;
	price: string;
	case: string;
	mode: string; // comma-separated input → split into string[] on submit
	images: string[]; // dynamic list of URL strings
	featured: boolean;
};

const empty: Draft = {
	color: '',
	size: '',
	stock: '',
	price: '',
	case: '',
	mode: '',
	images: [],
	featured: false,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VariantFormModal({
	isOpen,
	onClose,
	onSave,
	variant,
}: VariantFormModalProps) {
	const isEditMode = !!variant;

	const [draft, setDraft] = useState<Draft>(empty);
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const set = (key: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) =>
		setDraft((prev) => ({ ...prev, [key]: e.target.value }));

	// Populate when modal opens
	useEffect(() => {
		if (!isOpen) return;
		if (variant) {
			setDraft({
				color: variant.color,
				size: String(variant.size),
				stock: String(variant.stock),
				price: String(variant.price),
				case: variant.case ?? '',
				mode: (variant.mode ?? []).join(', '),
				images: variant.images ?? [],
				featured: variant.featured ?? false,
			});
		} else {
			setDraft(empty);
		}
		setErrors({});
	}, [isOpen, variant]);

	// ─── Image helpers ────────────────────────────────────────────────────────

	const addImageField = () =>
		setDraft((prev) => ({ ...prev, images: [...prev.images, ''] }));

	const updateImage = (index: number, value: string) =>
		setDraft((prev) => {
			const updated = [...prev.images];
			updated[index] = value;
			return { ...prev, images: updated };
		});

	const removeImage = (index: number) =>
		setDraft((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));

	// ─── Validation ───────────────────────────────────────────────────────────

	const validate = () => {
		const e: Record<string, string> = {};
		if (!draft.color.trim()) e.color = 'Color is required';
		if (!draft.size || isNaN(Number(draft.size)) || Number(draft.size) <= 0)
			e.size = 'Valid size (mm) is required';
		if (!draft.stock || isNaN(Number(draft.stock)) || Number(draft.stock) < 0)
			e.stock = 'Valid stock quantity is required';
		if (!draft.price || isNaN(Number(draft.price)) || Number(draft.price) <= 0)
			e.price = 'Valid price is required';
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	// ─── Submit ───────────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		if (!validate()) return;
		setIsSaving(true);
		try {
			await onSave({
				color: draft.color.trim(),
				size: Number(draft.size),
				stock: Number(draft.stock),
				price: Number(draft.price),
				case: draft.case.trim(),
				mode: draft.mode
					.split(',')
					.map((m) => m.trim())
					.filter(Boolean),
				images: draft.images.map((img) => img.trim()).filter(Boolean),
				featured: draft.featured,
			});
			onClose();
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : 'Something went wrong';
			setErrors((prev) => ({ ...prev, submit: message }));
		} finally {
			setIsSaving(false);
		}
	};

	// ─── Render ───────────────────────────────────────────────────────────────

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => !isSaving && onClose()}
			className='max-w-lg w-full m-4 p-6'
			showCloseButton={false}
		>
			<div className='flex flex-col gap-5'>
				{/* Header */}
				<div>
					<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
						{isEditMode ? 'Edit Variant' : 'Add Variant'}
					</h4>
					<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
						{isEditMode
							? 'Update the variant details below.'
							: 'Fill in the details for the new variant.'}
					</p>
				</div>

				{/* ── Core Fields ── */}
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label htmlFor='v-color'>Color</Label>
						<Input
							id='v-color'
							placeholder='e.g. Midnight Black'
							value={draft.color}
							onChange={set('color')}
							error={!!errors.color}
							hint={errors.color}
						/>
					</div>
					<div>
						<Label htmlFor='v-case'>Case Material</Label>
						<Input
							id='v-case'
							placeholder='e.g. Titanium'
							value={draft.case}
							onChange={set('case')}
						/>
					</div>
					<div>
						<Label htmlFor='v-size'>Size (mm)</Label>
						<Input
							id='v-size'
							type='number'
							placeholder='e.g. 44'
							value={draft.size}
							onChange={set('size')}
							error={!!errors.size}
							hint={errors.size}
							min='0'
						/>
					</div>
					<div>
						<Label htmlFor='v-price'>Price ($)</Label>
						<Input
							id='v-price'
							type='number'
							placeholder='e.g. 299'
							value={draft.price}
							onChange={set('price')}
							error={!!errors.price}
							hint={errors.price}
							min='0'
						/>
					</div>
					<div className='col-span-2'>
						<Label htmlFor='v-stock'>Stock</Label>
						<Input
							id='v-stock'
							type='number'
							placeholder='e.g. 50'
							value={draft.stock}
							onChange={set('stock')}
							error={!!errors.stock}
							hint={errors.stock}
							min='0'
						/>
					</div>
				</div>

				{/* ── Mode ── */}
				<div>
					<Label htmlFor='v-mode'>Modes</Label>
					<Input
						id='v-mode'
						placeholder='e.g. GPS, LTE, WiFi'
						value={draft.mode}
						onChange={set('mode')}
						hint='Separate multiple modes with a comma'
					/>
				</div>

				{/* ── Images ── */}
				<div>
					<Label>Images</Label>
					<ImageUploader
						images={draft.images}
						onChange={(urls) => setDraft((prev) => ({ ...prev, images: urls }))}
					/>
				</div>
				{/* ── Featured ── */}
				<div className='flex items-center gap-3'>
					<input
						id='v-featured'
						type='checkbox'
						checked={draft.featured}
						onChange={(e) =>
							setDraft((prev) => ({ ...prev, featured: e.target.checked }))
						}
						className='w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer'
					/>
					<label
						htmlFor='v-featured'
						className='text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer'
					>
						Featured variant
					</label>
					<span className='text-xs text-gray-400 dark:text-gray-500'>
						Shown as the default on the product page
					</span>
				</div>

				{/* Submit error */}
				{errors.submit && (
					<p className='text-sm text-error-500'>{errors.submit}</p>
				)}

				{/* Actions */}
				<div className='flex justify-end gap-3 pt-1'>
					<Button
						variant='outline'
						size='sm'
						onClick={onClose}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button size='sm' onClick={handleSubmit} disabled={isSaving}>
						{isSaving
							? isEditMode
								? 'Saving...'
								: 'Adding...'
							: isEditMode
								? 'Save Changes'
								: 'Add Variant'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
