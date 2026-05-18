import { useRef, useState } from 'react';
import { deleteImage, uploadImage } from '../../api/uploadApi';

interface ImageUploaderProps {
	images: string[];
	onChange: (images: string[]) => void;
}

const CloseIcon = () => (
	<svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
		<path
			d='M18 6L6 18M6 6l12 12'
			stroke='currentColor'
			strokeWidth='2.5'
			strokeLinecap='round'
		/>
	</svg>
);

const UploadIcon = () => (
	<svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
		<path
			d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<polyline
			points='17 8 12 3 7 8'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<line
			x1='12'
			y1='3'
			x2='12'
			y2='15'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
		/>
	</svg>
);

export default function ImageUploader({
	images,
	onChange,
}: ImageUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		if (files.length === 0) return;

		setUploading(true);
		setError('');

		try {
			const urls = await Promise.all(files.map((file) => uploadImage(file)));
			onChange([...images, ...urls]);
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Upload failed';
			setError(msg);
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = '';
		}
	};

	const removeImage = async (index: number) => {
		const confirmed = window.confirm(
			'Are you sure you want to remove this image? It will be removed permanently!',
		);
		if (!confirmed) return;
		const url = images[index];
		try {
			await deleteImage(url);
		} catch (error) {}
		onChange(images.filter((_, i) => i !== index));
	};

	return (
		<div className='flex flex-col gap-3'>
			{images.length > 0 && (
				<div className='grid grid-cols-3 gap-2'>
					{images.map((url, index) => (
						<div
							key={index}
							className='relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.03]'
						>
							<img
								src={url}
								alt={`Variant image ${index + 1}`}
								className='w-full h-full object-cover'
							/>
							<button
								type='button'
								onClick={() => removeImage(index)}
								className='absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity'
								title='Remove image'
							>
								<CloseIcon />
							</button>
						</div>
					))}
				</div>
			)}

			<button
				type='button'
				onClick={() => inputRef.current?.click()}
				disabled={uploading}
				className='flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/[0.10] text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-500 dark:hover:border-brand-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
			>
				<UploadIcon />
				{uploading
					? 'Uploading...'
					: images.length > 0
						? 'Add more images'
						: 'Upload images'}
			</button>

			<input
				ref={inputRef}
				type='file'
				accept='image/jpeg,image/png,image/webp,image/gif'
				multiple
				className='hidden'
				onChange={handleFileChange}
			/>

			{error && <p className='text-xs text-error-500'>{error}</p>}
		</div>
	);
}
