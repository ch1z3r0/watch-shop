import { OrderStatus } from '../../types/order';

const statusStyles: Record<OrderStatus, string> = {
	Pending:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
	Processing:
		'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
	Delivering:
		'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
	Delivered:
		'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
	Cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
		>
			{status}
		</span>
	);
}
