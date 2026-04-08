import api from './axios';
import { Product } from '../types/product';

export const getProducts = async (): Promise<Product[]> => {
	const res = await api.get('/api/products');
	return res.data;
};
