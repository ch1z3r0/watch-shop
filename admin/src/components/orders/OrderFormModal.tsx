import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import Select from '../form/Select';
import { Order, OrderItem, OrderStatus } from '../../types/order';
import { Product, Variant } from '../../types/product';
import { getProducts } from '../../api/productApi';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// Extends OrderItem with UI-only tracking fields
interface OrderItemDraft extends OrderItem {
	_selectedProductId: string;
	_selectedVariantId: string;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Processing', label: 'Processing' },
	{ value: 'Delivering', label: 'Delivering' },
	{ value: 'Delivered', label: 'Delivered' },
	{ value: 'Cancelled', label: 'Cancelled' },
];

const emptyItemDraft: OrderItemDraft = {
	_selectedProductId: '',
	_selectedVariantId: '',
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

// ─── Component ────────────────────────────────────────────────────────────────

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
	const [items, setItems] = useState<OrderItemDraft[]>([{ ...emptyItemDraft }]);

	// Products data
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// ─── Fetch products when modal opens ──────────────────────────────────────

	useEffect(() => {
		if (!isOpen) return;

		const fetchProducts = async () => {
			setIsLoadingProducts(true);
			try {
				const data = await getProducts();
				setProducts(data);
			} catch (err) {
				console.error('Failed to fetch products', err);
			} finally {
				setIsLoadingProducts(false);
			}
		};

		fetchProducts();
	}, [isOpen]);

	// ─── Populate fields when modal opens ─────────────────────────────────────

	useEffect(() => {
		if (!isOpen) return;
		if (order) {
			setCustomerName(order.customerName);
			setCustomerEmail(order.customerEmail);
			setShippingAddress(order.shippingAddress);
			setPhone(order.phone);
			setNotes(order.notes);
			setStatus(order.status);
			// In edit mode, wrap existing items with empty draft fields
			setItems(
				order.items.map((item) => ({
					...item,
					_selectedProductId: item.productId,
					_selectedVariantId: item.variantId,
				})),
			);
		} else {
			setCustomerName('');
			setCustomerEmail('');
			setShippingAddress('');
			setPhone('');
			setNotes('');
			setStatus('Pending');
			setItems([{ ...emptyItemDraft }]);
		}
		setErrors({});
	}, [isOpen, order]);

	// ─── Item Helpers ─────────────────────────────────────────────────────────

	// When admin picks a product, reset the item and store the product info
	const handleProductSelect = (index: number, productId: string) => {
		const product = products.find((p) => p.productId === productId);
		if (!product) return;

		setItems((prev) =>
			prev.map((item, i) =>
				i === index
					? {
							...emptyItemDraft,
							_selectedProductId: productId,
							_selectedVariantId: '',
							productId: product.productId,
							productName: product.name,
						}
					: item,
			),
		);
	};

	// When admin picks a variant, auto-fill all variant fields
	const handleVariantSelect = (index: number, variantId: string) => {
		const item = items[index];
		const product = products.find(
			(p) => p.productId === item._selectedProductId,
		);
		if (!product) return;

		const variant = product.variants.find((v) => v.variantId === variantId);
		if (!variant) return;

		setItems((prev) =>
			prev.map((itm, i) =>
				i === index
					? {
							...itm,
							_selectedVariantId: variantId,
							variantId: variant.variantId,
							variantColor: variant.color,
							size: variant.size,
							case: variant.case,
							mode: variant.mode,
							image: variant.images,
							price: variant.price,
							// keep quantity as is
						}
					: itm,
			),
		);
	};

	const updateItem = (
		index: number,
		field: keyof OrderItemDraft,
		value: unknown,
	) => {
		setItems((prev) =>
			prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
		);
	};

	const addItem = () => setItems((prev) => [...prev, { ...emptyItemDraft }]);

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
			if (!item.productId) e[`item_${i}_product`] = 'Select a product';
			if (!item.variantId) e[`item_${i}_variant`] = 'Select a variant';
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
			// Strip the UI-only draft fields before sending to backend
			const cleanItems: OrderItem[] = items.map(
				({ _selectedProductId, _selectedVariantId, ...rest }) => rest,
			);

			await onSave({
				customerName: customerName.trim(),
				customerEmail: customerEmail.trim(),
				shippingAddress: shippingAddress.trim(),
				phone: phone.trim(),
				notes: notes.trim(),
				status,
				items: cleanItems,
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
						{items.map((item, index) => {
							// Get variants for the selected product
							const selectedProduct = products.find(
								(p) => p.productId === item._selectedProductId,
							);
							const variantOptions =
								selectedProduct?.variants.map((v) => ({
									value: v.variantId,
									label: [
										v.color,
										`${v.size}mm`,
										v.case ? v.case : null,
										`$${v.price}`,
									]
										.filter(Boolean)
										.join(' — '),
								})) ?? [];

							return (
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

									{/* Product Select */}
									<div>
										<Label>Product</Label>
										{isLoadingProducts ? (
											<div className='h-10 rounded-lg bg-gray-100 dark:bg-white/[0.05] animate-pulse' />
										) : (
											<Select
												options={products.map((p) => ({
													value: p.productId,
													label: p.name,
												}))}
												placeholder='Select a product'
												defaultValue={item._selectedProductId}
												onChange={(val) => handleProductSelect(index, val)}
											/>
										)}
										{errors[`item_${index}_product`] && (
											<p className='mt-1 text-xs text-error-500'>
												{errors[`item_${index}_product`]}
											</p>
										)}
									</div>

									{/* Variant Select — only shows after product is picked */}
									{item._selectedProductId && (
										<div>
											<Label>Variant</Label>
											<Select
												key={item._selectedProductId}
												options={variantOptions}
												placeholder='Select a variant'
												defaultValue={item._selectedVariantId}
												onChange={(val) => handleVariantSelect(index, val)}
											/>
											{errors[`item_${index}_variant`] && (
												<p className='mt-1 text-xs text-error-500'>
													{errors[`item_${index}_variant`]}
												</p>
											)}
										</div>
									)}

									{/* Auto-filled details — shows after variant is picked */}
									{item._selectedVariantId && (
										<div className='grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-white/[0.05]'>
											<div>
												<p className='text-xs text-gray-400 mb-0.5'>Color</p>
												<p className='text-sm text-gray-700 dark:text-gray-300'>
													{item.variantColor}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-400 mb-0.5'>Size</p>
												<p className='text-sm text-gray-700 dark:text-gray-300'>
													{item.size}mm
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-400 mb-0.5'>
													Case Material
												</p>
												<p className='text-sm text-gray-700 dark:text-gray-300'>
													{item.case || '—'}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-400 mb-0.5'>Price</p>
												<p className='text-sm text-gray-700 dark:text-gray-300'>
													${item.price}
												</p>
											</div>
											{item.mode.length > 0 && (
												<div className='col-span-2'>
													<p className='text-xs text-gray-400 mb-0.5'>Modes</p>
													<p className='text-sm text-gray-700 dark:text-gray-300'>
														{item.mode.join(', ')}
													</p>
												</div>
											)}

											{/* Quantity */}
											<div>
												<Label>Quantity</Label>
												<Input
													type='number'
													placeholder='e.g. 1'
													value={item.quantity || ''}
													onChange={(e) =>
														updateItem(
															index,
															'quantity',
															Number(e.target.value),
														)
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
									)}
								</div>
							);
						})}
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
