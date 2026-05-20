import { Brand } from '../types/brand';
import api from './axios';

export const getBrands = async (): Promise<Brand[]> => {
	const res = await api.get('/api/brands');
	return res.data;
};

export const deleteBrand = async (BrandId: string): Promise<void> => {
	await api.delete(`/api/brands/${BrandId}`);
};

export const createBrand = async (payload: {
	name: string;
	slug: string;
}): Promise<Brand> => {
	const res = await api.post('/api/brands', payload);
	return res.data;
};

export const updateBrand = async (
	BrandId: string,
	payload: {
		name: string;
		slug: string;
	},
): Promise<Brand> => {
	const res = await api.put(`/api/brands/${BrandId}`, payload);
	return res.data;
};
