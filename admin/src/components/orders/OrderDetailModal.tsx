import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { Order } from '../../types/order';
import StatusBadge from './StatusBadge';

interface Props {
	isOpen: boolean;
	onClose: () => void;
	order: Order | null;
}

export default function OrderDetailModal({ isOpen, onClose, order }: Props) {
	if (!order) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			className='max-w-2xl w-full m-4 p-6'
			showCloseButton={false}
		>
			<div className='flex flex-col gap-5 max-h-[80vh] overflow-y-auto scrollbar-none pr-1'>
				{/* Header */}
				<div className='flex items-start justify-between'>
					<div>
						<h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
							Order Details
						</h4>
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
							{order.orderId}
						</p>
					</div>
					<StatusBadge status={order.status} />
				</div>

				{/* Customer Info */}
				<div className='grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]'>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Customer Name</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{order.customerName}
						</p>
					</div>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Email</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{order.customerEmail}
						</p>
					</div>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Phone</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{order.phone}
						</p>
					</div>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Shipping Address</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{order.shippingAddress}
						</p>
					</div>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Order Date</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{new Date(order.createdAt).toLocaleDateString()}
						</p>
					</div>
					<div>
						<p className='text-xs text-gray-400 mb-0.5'>Last Updated</p>
						<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
							{new Date(order.updatedAt).toLocaleDateString()}
						</p>
					</div>
				</div>

				{/* Notes */}
				{order.notes && (
					<div className='p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05]'>
						<p className='text-xs text-gray-400 mb-0.5'>Notes</p>
						<p className='text-sm text-gray-700 dark:text-gray-300'>
							{order.notes}
						</p>
					</div>
				)}

				{/* Order Items */}
				<div>
					<p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
						Items ({order.items.length})
					</p>
					<div className='flex flex-col gap-3'>
						{order.items.map((item, index) => (
							<div
								key={index}
								className='flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-white dark:bg-white/[0.03]'
							>
								{/* Image */}
								{item.image[0] && (
									<img
										src={item.image[0]}
										alt={item.productName}
										className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
									/>
								)}

								{/* Info */}
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-gray-800 dark:text-white/90 truncate'>
										{item.productName}
									</p>
									<div className='flex flex-wrap gap-x-3 gap-y-0.5 mt-1'>
										<span className='text-xs text-gray-400'>
											Color: {item.variantColor}
										</span>
										<span className='text-xs text-gray-400'>
											Size: {item.size}mm
										</span>
										{item.case && (
											<span className='text-xs text-gray-400'>
												Case: {item.case}
											</span>
										)}
										{item.mode.length > 0 && (
											<span className='text-xs text-gray-400'>
												Mode: {item.mode.join(', ')}
											</span>
										)}
									</div>
								</div>

								{/* Price + Qty */}
								<div className='text-right flex-shrink-0'>
									<p className='text-sm font-medium text-gray-800 dark:text-white/90'>
										${(item.price * item.quantity).toFixed(2)}
									</p>
									<p className='text-xs text-gray-400 mt-0.5'>
										${item.price} x {item.quantity}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Total */}
				<div className='flex justify-end items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/[0.05]'>
					<span className='text-sm text-gray-500'>Total Amount</span>
					<span className='text-base font-semibold text-gray-800 dark:text-white/90'>
						${order.totalAmount.toFixed(2)}
					</span>
				</div>

				{/* Actions */}
				<div className='flex justify-end'>
					<Button variant='outline' size='sm' onClick={onClose}>
						Close
					</Button>
				</div>
			</div>
		</Modal>
	);
}
