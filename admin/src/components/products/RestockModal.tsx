import { useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import { Variant } from '../../types/product';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onRestock: (quantity: number) => Promise<void>;
	variant: Variant | null;
}

export default function RestockModal({
	isOpen,
	onClose,
	onRestock,
	variant,
}: Props) {
	const [quantity, setQuantity] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');

	const handleClose = () => {
		setQuantity('');
		setError('');
		onClose();
	};

	const handleSubmit = async () => {
		const qty = Number(quantity);
		if (!qty || qty <= 0) {
			setError('Please enter a valid quantity');
			return;
		}
		setIsSaving(true);
		try {
			await onRestock(qty);
			handleClose();
		} catch (err: unknown) {
			let message = 'Something went wrong';
			if (
				typeof err === 'object' &&
				err !== null &&
				'response' in err &&
				typeof (err as any).response?.data?.message === 'string'
			) {
				message = (err as any).response.data.message;
			}
			setError(message);
		} finally {
			setIsSaving(false);
		}
	};

	if (!variant) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => !isSaving && handleClose()}
			className='max-w-sm w-full m-4 p-6'
			showCloseButton={false}
		>
			<div className='flex flex-col gap-4'>
				{/* Header */}
				<div>
					<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
						Restock Variant
					</h4>
					<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
						Add units to the current stock.
					</p>
				</div>

				{/* Variant info */}
				<div className='p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] flex flex-col gap-1'>
					<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
						{variant.color} — {variant.size}mm
						{variant.case ? ` — ${variant.case}` : ''}
					</p>
					<p className='text-xs text-gray-400'>
						Current stock:{' '}
						<span
							className={`font-medium ${
								variant.stock === 0
									? 'text-error-500'
									: variant.stock <= 5
										? 'text-warning-500'
										: 'text-success-500'
							}`}
						>
							{variant.stock} units
						</span>
					</p>
				</div>

				{/* Quantity input */}
				<div>
					<Label>Units to Add</Label>
					<Input
						type='number'
						placeholder='e.g. 10'
						value={quantity}
						onChange={(e) => {
							setQuantity(e.target.value);
							setError('');
						}}
						min='1'
						error={!!error}
						hint={error}
					/>
					{quantity && Number(quantity) > 0 && (
						<p className='text-xs text-gray-400 mt-1.5'>
							New stock will be:{' '}
							<span className='font-medium text-gray-700 dark:text-gray-300'>
								{variant.stock + Number(quantity)} units
							</span>
						</p>
					)}
				</div>

				{/* Actions */}
				<div className='flex justify-end gap-3 pt-1'>
					<Button
						variant='outline'
						size='sm'
						onClick={handleClose}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button size='sm' onClick={handleSubmit} disabled={isSaving}>
						{isSaving ? 'Restocking...' : 'Add Stock'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
