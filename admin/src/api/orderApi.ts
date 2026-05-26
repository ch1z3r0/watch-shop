import { Order } from '../types/order';
import api from './axios';

export const getOrders = async (): Promise<Order[]> => {
	const res = await api.get('/api/orders');
	return res.data;
};

export const deleteOrder = async (orderId: string): Promise<void> => {
	await api.delete(`/api/orders/${orderId}`);
};

export const createOrder = async (
	payload: Omit<Order, 'orderId' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<Order> => {
	const res = await api.post('/api/orders', payload);
	return res.data;
};

export const updateOrder = async (
	orderId: string,
	payload: Partial<Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>>,
): Promise<Order> => {
	const res = await api.patch(`/api/orders/${orderId}`, payload);
	return res.data;
};
