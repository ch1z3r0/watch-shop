import { Brand } from '../types/brand';
import api from './axios';

export const getBrands = async (): Promise<Brand[]> => {
	const res = await api.get('/api/brands');
	return res.data;
};
