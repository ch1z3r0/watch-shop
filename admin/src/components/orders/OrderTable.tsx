import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';
import Button from '../ui/button/Button';
import { Modal } from '../ui/modal';
import { Order, OrderStatus } from '../../types/order';
import useOrders from '../../hooks/useOrders';
import OrderDetailModal from './OrderDetailModal';
import OrderFormModal from './OrderFormModal';
import StatusDropdown from './StatusDropdown';

const COLUMNS = [
	{ label: 'Order ID', key: 'orderId', sortable: true },
	{ label: 'Customer', key: 'customerName', sortable: true },
	{ label: 'Items', key: 'items', sortable: false },
	{ label: 'Total', key: 'totalAmount', sortable: true },
	{ label: 'Status', key: 'status', sortable: true },
	{ label: 'Added', key: 'createdAt', sortable: true },
	{ label: 'Updated', key: 'updatedAt', sortable: true },
	{ label: 'Actions', key: 'actions', sortable: false },
];

const STATUS_TABS: (OrderStatus | 'All')[] = [
	'All',
	'Pending',
	'Processing',
	'Delivering',
	'Delivered',
	'Cancelled',
];

// ─── Icons ────────────────────────────────────────────────────────────────────

const EditIcon = () => (
	<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
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
	<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
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

const EyeIcon = () => (
	<svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
		<path
			d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<circle
			cx='12'
			cy='12'
			r='3'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
	return (
		<TableRow>
			{COLUMNS.map((col) => (
				<TableCell key={col.key} className='px-4 py-3'>
					<div className='h-4 rounded bg-gray-100 dark:bg-white/[0.05] animate-pulse' />
				</TableCell>
			))}
		</TableRow>
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderTable() {
	const {
		isLoading,
		filteredOrders,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		addOrder,
		editOrder,
		removeOrder,
	} = useOrders();

	// Sort toggle
	const toggleSort = (key: string) => {
		if (
			![
				'orderId',
				'customerName',
				'totalAmount',
				'status',
				'createdAt',
			].includes(key)
		)
			return;
		const column = key as
			| 'orderId'
			| 'customerName'
			| 'totalAmount'
			| 'status'
			| 'createdAt'
			| 'updatedAt';
		setSort((prev) => ({
			column,
			direction:
				prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
		}));
	};

	// Modal state
	const [detailTarget, setDetailTarget] = useState<Order | null>(null);
	const [formTarget, setFormTarget] = useState<Order | null | undefined>(
		undefined,
	);
	const isFormOpen = formTarget !== undefined;

	const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// Handlers
	const handleSave = async (
		payload: Omit<Order, 'orderId' | 'status' | 'createdAt' | 'updatedAt'> & {
			status?: OrderStatus;
		},
	) => {
		if (formTarget != null) {
			await editOrder(formTarget.orderId, payload);
		} else {
			await addOrder(payload);
		}
	};

	const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
		await editOrder(orderId, { status });
	};

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			await removeOrder(deleteTarget.orderId);
		} finally {
			setIsDeleting(false);
			setDeleteTarget(null);
		}
	};

	return (
		<>
			{/* Toolbar */}
			<div className='flex flex-col gap-3 mb-4'>
				{/* Status tabs */}
				<div className='flex items-center gap-2 flex-wrap'>
					{STATUS_TABS.map((tab) => (
						<button
							key={tab}
							onClick={() => setStatusFilter(tab)}
							className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
								statusFilter === tab
									? 'bg-brand-500 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.08]'
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				{/* Search + Add */}
				<div className='flex items-center gap-3'>
					<input
						type='text'
						placeholder='Search by order ID, customer name or email'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500'
					/>
					<Button size='sm' onClick={() => setFormTarget(null)}>
						+ Add Order
					</Button>
				</div>
			</div>

			{/* Table */}
			<div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
				<div className='max-w-full overflow-x-auto'>
					<Table>
						<TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
							<TableRow>
								{COLUMNS.map((col) => (
									<TableCell
										key={col.key}
										isHeader
										className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
									>
										<div
											className={`flex items-center gap-1 ${col.sortable ? 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300' : ''}`}
											onClick={() => col.sortable && toggleSort(col.key)}
										>
											{col.label}
											{col.sortable && (
												<span className='text-gray-300 dark:text-gray-600 pointer-events-none'>
													{sort.column === col.key
														? sort.direction === 'asc'
															? '↑'
															: '↓'
														: '↕'}
												</span>
											)}
										</div>
									</TableCell>
								))}
							</TableRow>
						</TableHeader>

						<TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
							{isLoading
								? Array.from({ length: 5 }).map((_, i) => (
										<SkeletonRow key={i} />
									))
								: filteredOrders.map((order) => (
										<TableRow key={order.orderId}>
											{/* Order ID */}
											<TableCell className='px-5 py-4 text-start'>
												<span className='font-medium text-gray-800 text-theme-sm dark:text-white/90'>
													{order.orderId}
												</span>
											</TableCell>

											{/* Customer */}
											<TableCell className='px-4 py-3 text-start'>
												<span className='block text-sm text-gray-800 dark:text-white/90 font-medium'>
													{order.customerName}
												</span>
												<span className='block text-xs text-gray-400 mt-0.5'>
													{order.customerEmail}
												</span>
											</TableCell>

											{/* Items count */}
											<TableCell className='px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400'>
												{order.items.length}{' '}
												{order.items.length === 1 ? 'item' : 'items'}
											</TableCell>

											{/* Total */}
											<TableCell className='px-4 py-3 text-start text-theme-sm font-medium text-gray-800 dark:text-white/90'>
												${order.totalAmount.toFixed(2)}
											</TableCell>

											{/* Status */}
											<TableCell className='px-4 py-3 text-start'>
												<StatusDropdown
													orderId={order.orderId}
													status={order.status}
													onUpdate={handleUpdateStatus}
												/>
											</TableCell>

											{/* Added Date */}
											<TableCell className='px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400'>
												{new Date(order.createdAt).toLocaleDateString()}
											</TableCell>
											{/* Updated Date */}
											<TableCell className='px-4 py-3 text-start text-theme-sm text-gray-500 dark:text-gray-400'>
												{new Date(order.updatedAt).toLocaleDateString()}
											</TableCell>

											{/* Actions */}
											<TableCell className='px-4 py-3 text-start'>
												<div className='flex items-center gap-2'>
													<button
														onClick={() => setDetailTarget(order)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
														title='View details'
													>
														<EyeIcon />
													</button>
													<button
														onClick={() => setFormTarget(order)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors'
														title='Edit order'
													>
														<EditIcon />
													</button>
													<button
														onClick={() => setDeleteTarget(order)}
														className='p-1.5 rounded-lg text-gray-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors'
														title='Delete order'
													>
														<TrashIcon />
													</button>
												</div>
											</TableCell>
										</TableRow>
									))}

							{!isLoading && filteredOrders.length === 0 && (
								<tr>
									<td
										colSpan={COLUMNS.length}
										className='px-5 py-8 text-center text-gray-400 text-sm'
									>
										No orders found
									</td>
								</tr>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Detail Modal */}
			<OrderDetailModal
				isOpen={!!detailTarget}
				onClose={() => setDetailTarget(null)}
				order={detailTarget}
			/>

			{/* Add / Edit Modal */}
			<OrderFormModal
				isOpen={isFormOpen}
				onClose={() => setFormTarget(undefined)}
				onSave={handleSave}
				order={formTarget ?? null}
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
							Delete Order
						</h4>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Are you sure you want to delete order{' '}
							<span className='font-medium text-gray-700 dark:text-gray-300'>
								{deleteTarget?.orderId}
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
