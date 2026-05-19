import { Category } from '../types/category';
import api from './axios';

export const getCategories = async (): Promise<Category[]> => {
	const res = await api.get('/api/categories');
	return res.data;
};
