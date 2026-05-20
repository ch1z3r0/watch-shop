import { Category } from '../types/category';
import api from './axios';

export const getCategories = async (): Promise<Category[]> => {
	const res = await api.get('/api/categories');
	return res.data;
};
export const deleteCategory = async (categoryId: string): Promise<void> => {
	await api.delete(`/api/categories/${categoryId}`);
};

export const createCategory = async (payload: {
	name: string;
	slug: string;
}): Promise<Category> => {
	const res = await api.post(`/api/categories`, payload);
	return res.data;
};

export const updateCategory = async (
	categoryId: string,
	payload: {
		name: string;
		slug: string;
	},
): Promise<Category> => {
	const res = await api.put(`/api/categories/${categoryId}`, payload);
	return res.data;
};
