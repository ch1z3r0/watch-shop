import api from './axios';
import { Product, Variant } from '../types/product';

export const getProducts = async (): Promise<Product[]> => {
	const res = await api.get('/api/products');
	return res.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
	await api.delete(`/api/products/${productId}`);
};

export const createProduct = async (payload: {
	name: string;
	slug: string;
	brandId: string;
	categoryId: string;
	variants: Omit<Variant, 'variantId'>[];
}): Promise<Product> => {
	const res = await api.post('/api/products', payload);
	return res.data;
};

export const updateProduct = async (
	productId: string,
	payload: { name: string; slug: string; brandId: string; categoryId: string },
) => {
	const res = await api.put(`/api/products/${productId}`, payload);
	return res.data;
};

// ─── Variant API ──────────────────────────────────────────────────────────────
export const addVariant = async (
	productId: string,
	payload: Omit<Variant, 'variantId'>,
): Promise<Product> => {
	const res = await api.post(`/api/products/${productId}/variants`, payload);
	return res.data.product;
};

export const updateVariant = async (
	productId: string,
	variantId: string,
	payload: Omit<Variant, 'variantId'>,
): Promise<Product> => {
	const res = await api.put(
		`/api/products/${productId}/variants/${variantId}`,
		payload,
	);
	return res.data.product;
};

export const deleteVariant = async (
	productId: string,
	variantId: string,
): Promise<Product> => {
	const res = await api.delete(
		`/api/products/${productId}/variants/${variantId}`,
	);
	return res.data.product;
};
