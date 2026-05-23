import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import { Order, OrderItem, OrderStatus } from '../../types/order';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSave: (
		payload: Omit<Order, 'orderId' | 'status' | 'createdAt' | 'updatedAt'> & {
			status?: OrderStatus;
		},
	) => Promise<void>;
	order?: Order | null;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Processing', label: 'Processing' },
	{ value: 'Delivering', label: 'Delivering' },
	{ value: 'Delivered', label: 'Delivered' },
	{ value: 'Cancelled', label: 'Cancelled' },
];

const emptyItem: OrderItem = {
	productId: '',
	variantId: '',
	productName: '',
	variantColor: '',
	size: 0,
	case: '',
	mode: [],
	image: [],
	price: 0,
	quantity: 1,
};

export default function OrderFormModal({
	isOpen,
	onClose,
	onSave,
	order,
}: Props) {
	const isEditMode = !!order;

	// Customer fields
	const [customerName, setCustomerName] = useState('');
	const [customerEmail, setCustomerEmail] = useState('');
	const [shippingAddress, setShippingAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [notes, setNotes] = useState('');
	const [status, setStatus] = useState<OrderStatus>('Pending');

	// Items
	const [items, setItems] = useState<OrderItem[]>([{ ...emptyItem }]);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Populate fields when modal opens
	useEffect(() => {
		if (!isOpen) return;
		if (order) {
			setCustomerName(order.customerName);
			setCustomerEmail(order.customerEmail);
			setShippingAddress(order.shippingAddress);
			setPhone(order.phone);
			setNotes(order.notes);
			setStatus(order.status);
			setItems(order.items);
		} else {
			setCustomerName('');
			setCustomerEmail('');
			setShippingAddress('');
			setPhone('');
			setNotes('');
			setStatus('Pending');
			setItems([{ ...emptyItem }]);
		}
		setErrors({});
	}, [isOpen, order]);

	// ─── Item Helpers ─────────────────────────────────────────────────────────

	const updateItem = (
		index: number,
		field: keyof OrderItem,
		value: unknown,
	) => {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);

	const removeItem = (index: number) =>
		setItems((prev) => prev.filter((_, i) => i !== index));

	// ─── Computed Total ───────────────────────────────────────────────────────

	const totalAmount = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	// ─── Validation ───────────────────────────────────────────────────────────

	const validate = () => {
		const e: Record<string, string> = {};
		if (!customerName.trim()) e.customerName = 'Customer name is required';
		if (!customerEmail.trim()) e.customerEmail = 'Email is required';
		if (!shippingAddress.trim())
			e.shippingAddress = 'Shipping address is required';
		if (!phone.trim()) e.phone = 'Phone is required';
		if (items.length === 0) e.items = 'At least one item is required';
		items.forEach((item, i) => {
			if (!item.productName.trim())
				e[`item_${i}_name`] = 'Product name is required';
			if (item.price <= 0) e[`item_${i}_price`] = 'Valid price is required';
			if (item.quantity <= 0) e[`item_${i}_qty`] = 'Valid quantity is required';
		});
		setErrors(e);
		return Object.keys(e).length === 0;
	};

	// ─── Submit ───────────────────────────────────────────────────────────────

	const handleSubmit = async () => {
		if (!validate()) return;
		setIsSaving(true);
		try {
			await onSave({
				customerName: customerName.trim(),
				customerEmail: customerEmail.trim(),
				shippingAddress: shippingAddress.trim(),
				phone: phone.trim(),
				notes: notes.trim(),
				status,
				items,
				totalAmount,
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
			className='max-w-2xl w-full m-4 p-6'
			showCloseButton={false}
		>
			<div className='flex flex-col gap-5 max-h-[80vh] overflow-y-auto no-scrollbar pr-1'>
				{/* Header */}
				<div>
					<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
						{isEditMode ? 'Edit Order' : 'Create Order'}
					</h4>
					<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
						{isEditMode
							? 'Update the order details below.'
							: 'Fill in the details to create a new order.'}
					</p>
				</div>

				{/* Customer Info */}
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<Label>Customer Name</Label>
						<Input
							placeholder='e.g. John Doe'
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							error={!!errors.customerName}
							hint={errors.customerName}
						/>
					</div>
					<div>
						<Label>Email</Label>
						<Input
							type='email'
							placeholder='e.g. john@email.com'
							value={customerEmail}
							onChange={(e) => setCustomerEmail(e.target.value)}
							error={!!errors.customerEmail}
							hint={errors.customerEmail}
						/>
					</div>
					<div>
						<Label>Phone</Label>
						<Input
							placeholder='e.g. 012 345 6789'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							error={!!errors.phone}
							hint={errors.phone}
						/>
					</div>
					<div>
						<Label>Shipping Address</Label>
						<Input
							placeholder='e.g. 123 Street, City'
							value={shippingAddress}
							onChange={(e) => setShippingAddress(e.target.value)}
							error={!!errors.shippingAddress}
							hint={errors.shippingAddress}
						/>
					</div>

					{/* Status — edit mode only */}
					{isEditMode && (
						<div>
							<Label>Status</Label>
							<Select
								options={STATUS_OPTIONS}
								defaultValue={status}
								onChange={(val) => setStatus(val as OrderStatus)}
							/>
						</div>
					)}

					{/* Notes */}
					<div className={isEditMode ? '' : 'col-span-2'}>
						<Label>Notes (optional)</Label>
						<Input
							placeholder='Any additional notes...'
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
						/>
					</div>
				</div>

				{/* Items */}
				<div className='border-t border-gray-100 dark:border-white/[0.05] pt-4'>
					<div className='flex items-center justify-between mb-3'>
						<p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
							Order Items
						</p>
						<button
							onClick={addItem}
							className='text-xs text-brand-500 hover:text-brand-600 font-medium'
						>
							+ Add Item
						</button>
					</div>

					{errors.items && (
						<p className='text-xs text-error-500 mb-2'>{errors.items}</p>
					)}

					<div className='flex flex-col gap-4'>
						{items.map((item, index) => (
							<div
								key={index}
								className='p-4 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02] flex flex-col gap-3'
							>
								{/* Item header */}
								<div className='flex items-center justify-between'>
									<p className='text-xs font-medium text-gray-500 dark:text-gray-400'>
										Item {index + 1}
									</p>
									{items.length > 1 && (
										<button
											onClick={() => removeItem(index)}
											className='text-xs text-error-500 hover:text-error-600'
										>
											Remove
										</button>
									)}
								</div>

								<div className='grid grid-cols-2 gap-3'>
									{/* Product Name */}
									<div className='col-span-2'>
										<Label>Product Name</Label>
										<Input
											placeholder='e.g. Galaxy Watch Ultra'
											value={item.productName}
											onChange={(e) =>
												updateItem(index, 'productName', e.target.value)
											}
											error={!!errors[`item_${index}_name`]}
											hint={errors[`item_${index}_name`]}
										/>
									</div>

									{/* Color */}
									<div>
										<Label>Color</Label>
										<Input
											placeholder='e.g. Midnight Black'
											value={item.variantColor}
											onChange={(e) =>
												updateItem(index, 'variantColor', e.target.value)
											}
										/>
									</div>

									{/* Case */}
									<div>
										<Label>Case Material</Label>
										<Input
											placeholder='e.g. Titanium'
											value={item.case}
											onChange={(e) =>
												updateItem(index, 'case', e.target.value)
											}
										/>
									</div>

									{/* Size */}
									<div>
										<Label>Size (mm)</Label>
										<Input
											type='number'
											placeholder='e.g. 44'
											value={item.size || ''}
											onChange={(e) =>
												updateItem(index, 'size', Number(e.target.value))
											}
											min='0'
										/>
									</div>

									{/* Price */}
									<div>
										<Label>Price ($)</Label>
										<Input
											type='number'
											placeholder='e.g. 299'
											value={item.price || ''}
											onChange={(e) =>
												updateItem(index, 'price', Number(e.target.value))
											}
											error={!!errors[`item_${index}_price`]}
											hint={errors[`item_${index}_price`]}
											min='0'
										/>
									</div>

									{/* Quantity */}
									<div>
										<Label>Quantity</Label>
										<Input
											type='number'
											placeholder='e.g. 1'
											value={item.quantity || ''}
											onChange={(e) =>
												updateItem(index, 'quantity', Number(e.target.value))
											}
											error={!!errors[`item_${index}_qty`]}
											hint={errors[`item_${index}_qty`]}
											min='1'
										/>
									</div>

									{/* Subtotal */}
									<div className='flex items-end'>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Subtotal:{' '}
											<span className='font-medium text-gray-800 dark:text-white/90'>
												${(item.price * item.quantity).toFixed(2)}
											</span>
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Total */}
				<div className='flex justify-end items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/[0.05]'>
					<span className='text-sm text-gray-500'>Total Amount</span>
					<span className='text-base font-semibold text-gray-800 dark:text-white/90'>
						${totalAmount.toFixed(2)}
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
								: 'Creating...'
							: isEditMode
								? 'Save Changes'
								: 'Create Order'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}
