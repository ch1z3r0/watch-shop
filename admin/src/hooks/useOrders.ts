import { Order, OrderStatus } from '../types/order';
import {
	createOrder,
	getOrders,
	updateOrder,
	deleteOrder,
} from '../api/orderApi';
import { useEffect, useMemo, useState } from 'react';

// --- Search, Filters, Sort types -------------------------------------------
type SortColumn =
	| 'orderId'
	| 'customerName'
	| 'totalAmount'
	| 'status'
	| 'createdAt'
	| 'updatedAt';
type SortDirection = 'asc' | 'desc';

export interface Sort {
	column: SortColumn;
	direction: SortDirection;
}

export interface OrderFilters {
	searchQuery: string;
	statusFilter: OrderStatus | 'All';
	sort: Sort;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
	const [sort, setSort] = useState<Sort>({
		column: 'createdAt',
		direction: 'desc',
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const orderData = await getOrders();
				setOrders(orderData);
			} catch (error) {
				console.error(error);
				setError('Failed to fetch orders');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredOrders = useMemo(() => {
		let result = [...orders];

		// --- Filter by status -----------------------------------------------------
		if (statusFilter !== 'All') {
			result = result.filter((o) => o.status === statusFilter);
		}

		// --- Search ---------------------------------------------------------------
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(o) =>
					o.orderId.toLowerCase().includes(q) ||
					o.customerName.toLowerCase().includes(q) ||
					o.customerEmail.toLowerCase().includes(q),
			);
		}

		// --- Sort ---------------------------------------------------------------
		result.sort((a, b) => {
			let valA: number | string = 0;
			let valB: number | string = 0;

			if (sort.column === 'orderId') {
				valA = a.orderId.toLowerCase();
				valB = b.orderId.toLowerCase();
			} else if (sort.column === 'customerName') {
				valA = a.customerName;
				valB = b.customerName;
			} else if (sort.column === 'totalAmount') {
				valA = a.totalAmount;
				valB = b.totalAmount;
			} else if (sort.column === 'status') {
				valA = a.status.toLowerCase();
				valB = b.status.toLowerCase();
			} else if (sort.column === 'createdAt') {
				valA = new Date(a.createdAt).getTime();
				valB = new Date(b.createdAt).getTime();
			} else if (sort.column === 'updatedAt') {
				valA = new Date(a.updatedAt).getTime();
				valB = new Date(b.updatedAt).getTime();
			}
			if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
			return 0;
		});

		return result;
	}, [searchQuery, statusFilter, sort, orders]);

	// --- Order Methods ---------------------------------------------------------
	const addOrder = async (
		payload: Omit<Order, 'orderId' | 'status' | 'createdAt' | 'updatedAt'>,
	) => {
		const createdOrder = await createOrder(payload);
		setOrders((prev) => [createdOrder, ...prev]);
	};
	const editOrder = async (
		orderId: string,
		payload: Partial<Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>>,
	) => {
		await updateOrder(orderId, payload);
		setOrders((prev) =>
			prev.map((o) => (o.orderId === orderId ? { ...o, ...payload } : o)),
		);
	};
	const removeOrder = async (orderId: string) => {
		await deleteOrder(orderId);
		setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
	};

	return {
		filteredOrders,
		orders,
		addOrder,
		editOrder,
		removeOrder,
		error,
		isLoading,
		statusFilter,
		setStatusFilter,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
	};
};

export default useOrders;
