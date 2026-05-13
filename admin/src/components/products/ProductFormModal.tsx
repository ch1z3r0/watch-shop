import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import { Product, Variant } from '../../types/product';
import { Brand } from '../../types/brand';
import { Category } from '../../types/category';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (
		data: { name: string; slug: string; brandId: string; categoryId: string },
		variant?: Omit<Variant, 'variantId'>,
	) => Promise<void>;
	product?: Product | null; // null = add mode, Product = edit mode
	brands: Brand[];
	categories: Category[];
}

type VariantDraft = {
	color: string;
	size: string;
	stock: string;
	price: string;
	case: string;
};

const emptyVariant: VariantDraft = {
	color: '',
	size: '',
	stock: '',
	price: '',
	case: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toSlug = (name: string) =>
	name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductFormModal({
	isOpen,
	onClose,
	onSave,
	product,
	brands,
	categories,
}: ProductFormModalProps) {
	const isEditMode = !!product;

	// Product fields
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [brandId, setBrandId] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

	// Initial variant (add mode only)
	const [variant, setVariant] = useState<VariantDraft>(emptyVariant);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Populate fields when modal opens
	useEffect(() => {
		if (!isOpen) return;
		if (product) {
			setName(product.name);
			setSlug(product.slug);
			setBrandId(product.brandId);
			setCategoryId(product.categoryId);
		} else {
			setName('');
			setSlug('');
			setBrandId('');
			setCategoryId('');
			setVariant(emptyVariant);
		}
		setSlugManuallyEdited(false);
		setErrors({});
	}, [isOpen, product]);

	// Auto-generate slug from name (unless manually edited)
	useEffect(() => {
		if (!slugManuallyEdited) setSlug(toSlug(name));
	}, [name, slugManuallyEdited]);

	// ─── Validation ───────────────────────────────────────────────────────────

	const validate = () => {
		const e: Record<string, string> = {};
		if (!name.trim()) e.name = 'Name is required';
		if (!slug.trim()) e.slug = 'Slug is required';
		if (!brandId) e.brandId = 'Brand is required';
		if (!categoryId) e.categoryId = 'Category is required';

		if (!isEditMode) {
			if (!variant.color.trim()) e.variantColor = 'Color is required';
			if (
				!variant.size ||
				isNaN(Number(variant.size)) ||
				Number(variant.size) <= 0
			)
				e.variantSize = 'Valid size (mm) is required';
			if (
				!variant.stock ||
				isNaN(Number(variant.stock)) ||
				Number(variant.stock) < 0
			)
				e.variantStock = 'Valid stock is required';
			if (
				!variant.price ||
				isNaN(Number(variant.price)) ||
				Number(variant.price) <= 0
			)
				e.variantPrice = 'Valid price is required';
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	};

	// ─── Submit ───────────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		if (!validate()) return;
		setIsSaving(true);
		try {
			const productPayload = {
				name: name.trim(),
				slug: slug.trim(),
				brandId,
				categoryId,
			};
			if (isEditMode) {
				await onSave(productPayload);
			} else {
				const variantPayload: Omit<Variant, 'variantId'> = {
					color: variant.color.trim(),
					size: Number(variant.size),
					stock: Number(variant.stock),
					price: Number(variant.price),
					case: variant.case.trim(),
					mode: [],
					images: [],
					featured: false,
				};
				await onSave(productPayload, variantPayload);
			}
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
			className='max-w-xl w-full m-4 p-6'
			showCloseButton={false}
		>
			<div className='flex flex-col gap-5'>
				{/* Header */}
				<div>
					<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
						{isEditMode ? 'Edit Product' : 'Add Product'}
					</h4>
					<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
						{isEditMode
							? 'Update the product details below.'
							: 'Fill in the details to create a new product.'}
					</p>
				</div>

				{/* ── Product Fields ── */}
				<div className='grid grid-cols-1 gap-4'>
					{/* Name */}
					<div>
						<Label htmlFor='prod-name'>Product Name</Label>
						<Input
							id='prod-name'
							placeholder='e.g. Galaxy Watch Ultra'
							value={name}
							onChange={(e) => setName(e.target.value)}
							error={!!errors.name}
							hint={errors.name}
						/>
					</div>

					{/* Slug */}
					<div>
						<Label htmlFor='prod-slug'>Slug</Label>
						<Input
							id='prod-slug'
							placeholder='e.g. galaxy-watch-ultra'
							value={slug}
							onChange={(e) => {
								setSlugManuallyEdited(true);
								setSlug(e.target.value);
							}}
							error={!!errors.slug}
							hint={errors.slug ?? 'Auto-generated from name'}
						/>
					</div>

					{/* Brand + Category side by side */}
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<Label htmlFor='prod-brand'>Brand</Label>
							<Select
								options={brands.map((b) => ({
									value: b.brandId,
									label: b.name,
								}))}
								placeholder='Select brand'
								onChange={setBrandId}
								defaultValue={brandId}
							/>
							{errors.brandId && (
								<p className='mt-1.5 text-xs text-error-500'>
									{errors.brandId}
								</p>
							)}
						</div>
						<div>
							<Label htmlFor='prod-category'>Category</Label>
							<Select
								options={categories.map((c) => ({
									value: c.categoryId,
									label: c.name,
								}))}
								placeholder='Select category'
								onChange={setCategoryId}
								defaultValue={categoryId}
							/>
							{errors.categoryId && (
								<p className='mt-1.5 text-xs text-error-500'>
									{errors.categoryId}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* ── Initial Variant (add mode only) ── */}
				{!isEditMode && (
					<div className='border-t border-gray-100 dark:border-white/[0.05] pt-4 flex flex-col gap-4'>
						<p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
							Initial Variant
						</p>

						<div className='grid grid-cols-2 gap-4'>
							{/* Color */}
							<div>
								<Label htmlFor='var-color'>Color</Label>
								<Input
									id='var-color'
									placeholder='e.g. Midnight Black'
									value={variant.color}
									onChange={(e) =>
										setVariant((v) => ({ ...v, color: e.target.value }))
									}
									error={!!errors.variantColor}
									hint={errors.variantColor}
								/>
							</div>

							{/* Case */}
							<div>
								<Label htmlFor='var-case'>Case Material</Label>
								<Input
									id='var-case'
									placeholder='e.g. Titanium'
									value={variant.case}
									onChange={(e) =>
										setVariant((v) => ({ ...v, case: e.target.value }))
									}
								/>
							</div>

							{/* Size */}
							<div>
								<Label htmlFor='var-size'>Size (mm)</Label>
								<Input
									id='var-size'
									type='number'
									placeholder='e.g. 44'
									value={variant.size}
									onChange={(e) =>
										setVariant((v) => ({ ...v, size: e.target.value }))
									}
									error={!!errors.variantSize}
									hint={errors.variantSize}
									min='0'
								/>
							</div>

							{/* Price */}
							<div>
								<Label htmlFor='var-price'>Price ($)</Label>
								<Input
									id='var-price'
									type='number'
									placeholder='e.g. 299'
									value={variant.price}
									onChange={(e) =>
										setVariant((v) => ({ ...v, price: e.target.value }))
									}
									error={!!errors.variantPrice}
									hint={errors.variantPrice}
									min='0'
								/>
							</div>

							{/* Stock */}
							<div className='col-span-2'>
								<Label htmlFor='var-stock'>Stock</Label>
								<Input
									id='var-stock'
									type='number'
									placeholder='e.g. 50'
									value={variant.stock}
									onChange={(e) =>
										setVariant((v) => ({ ...v, stock: e.target.value }))
									}
									error={!!errors.variantStock}
									hint={errors.variantStock}
									min='0'
								/>
							</div>
						</div>
					</div>
				)}

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
								: 'Creating...'
							: isEditMode
								? 'Save Changes'
								: 'Create Product'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
