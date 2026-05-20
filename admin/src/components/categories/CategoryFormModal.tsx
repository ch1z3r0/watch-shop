import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Category } from '../../types/category';
// import ImageUploader from './ImageUploader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CategoryFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: { name: string; slug: string }) => Promise<void>;
	category?: Category | null; // null = add mode, Category = edit mode
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toSlug = (name: string) =>
	name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategoryFormModal({
	isOpen,
	onClose,
	onSave,
	category,
}: CategoryFormModalProps) {
	const isEditMode = !!category;

	// Category fields
	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Populate fields when modal opens
	useEffect(() => {
		if (!isOpen) return;
		if (category) {
			setName(category.name);
			setSlug(category.slug);
		} else {
			setName('');
			setSlug('');
		}
		setSlugManuallyEdited(false);
		setErrors({});
	}, [isOpen, category]);

	// Auto-generate slug from name (unless manually edited)
	useEffect(() => {
		if (!slugManuallyEdited) setSlug(toSlug(name));
	}, [name, slugManuallyEdited]);

	// ─── Validation ───────────────────────────────────────────────────────────

	const validate = () => {
		const e: Record<string, string> = {};
		if (!name.trim()) e.name = 'Name is required';
		if (!slug.trim()) e.slug = 'Slug is required';

		setErrors(e);
		return Object.keys(e).length === 0;
	};

	// ─── Submit ───────────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		if (!validate()) return;
		setIsSaving(true);
		try {
			const categoryPayload = {
				name: name.trim(),
				slug: slug.trim(),
			};
			await onSave(categoryPayload);

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
			<div className='flex flex-col gap-5 max-h-[80vh] overflow-y-auto pr-1'>
				{/* Header */}
				<div>
					<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
						{isEditMode ? 'Edit Category' : 'Add Category'}
					</h4>
					<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
						{isEditMode
							? 'Update the category details below.'
							: 'Fill in the details to create a new category.'}
					</p>
				</div>

				{/* ── Category Fields ── */}
				<div className='grid grid-cols-1 gap-4'>
					{/* Name */}
					<div>
						<Label htmlFor='cat-name'>Category Name</Label>
						<Input
							id='cat-name'
							placeholder='e.g. Watch'
							value={name}
							onChange={(e) => setName(e.target.value)}
							error={!!errors.name}
							hint={errors.name}
						/>
					</div>

					{/* Slug */}
					<div>
						<Label htmlFor='cat-slug'>Slug</Label>
						<Input
							id='cat-slug'
							placeholder='e.g. watch'
							value={slug}
							onChange={(e) => {
								setSlugManuallyEdited(true);
								setSlug(e.target.value);
							}}
							error={!!errors.slug}
							hint={errors.slug ?? 'Auto-generated from name'}
						/>
					</div>
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
								: 'Creating...'
							: isEditMode
								? 'Save Changes'
								: 'Create Category'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
