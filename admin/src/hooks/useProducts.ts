import { useEffect, useMemo, useState } from 'react';
import { Product, Variant } from '../types/product';
import {
	getProducts,
	deleteProduct,
	createProduct,
	updateProduct,
	addVariant,
	updateVariant,
	deleteVariant,
} from '../api/productApi';
import { Brand } from '../types/brand';
import { getBrands } from '../api/brandApi';
import { Category } from '../types/category';
import { getCategories } from '../api/categoryApi';

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getTotalStock = (variants: Variant[]): number =>
	variants.reduce((sum, v) => sum + v.stock, 0);

export const getPriceRange = (variants: Variant[]): string => {
	if (!variants || variants.length === 0) return '—';
	const prices = variants.map((v) => v.price);
	const min = Math.min(...prices);
	const max = Math.max(...prices);
	const fmt = (n: number) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0,
		}).format(n);
	return min === max ? fmt(min) : `${fmt(min)} – ${fmt(max)}`;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [productsData, brandsData, categoryData] = await Promise.all([
					getProducts(),
					getBrands(),
					getCategories(),
				]);
				setProducts(productsData);
				setBrands(brandsData);
				setCategories(categoryData);
			} catch (error) {
				console.error(error);
				setError('Failed to fetch products');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const brandMap = useMemo(() => {
		return brands.reduce<Record<string, string>>((acc, brand) => {
			acc[brand.brandId] = brand.name;
			return acc;
		}, {});
	}, [brands]);
	const categoryMap = useMemo(() => {
		return categories.reduce<Record<string, string>>((acc, category) => {
			acc[category.categoryId] = category.name;
			return acc;
		}, {});
	}, [categories]);

	const removeProduct = async (productId: string) => {
		await deleteProduct(productId);
		setProducts((prev) => prev.filter((p) => p.productId !== productId));
	};
	// Replaces one product in state with the updated version returned by the backend
	const syncProduct = (updated: Product) =>
		setProducts((prev) =>
			prev.map((p) => (p.productId === updated.productId ? updated : p)),
		);
	// ─── Product Methods ─────────────────────────────────────────────────────────────────────

	const addProduct = async (payload: {
		name: string;
		slug: string;
		brandId: string;
		categoryId: string;
		variants: Omit<Variant, 'variantId'>[];
	}) => {
		const createdProduct = await createProduct(payload);
		setProducts((prev) => [createdProduct, ...prev]);
	};

	const editProduct = async (
		productId: string,
		payload: {
			name: string;
			slug: string;
			brandId: string;
			categoryId: string;
		},
	) => {
		await updateProduct(productId, payload);
		setProducts((prev) =>
			prev.map((p) => (p.productId === productId ? { ...p, ...payload } : p)),
		);
	};

	// ─── Variant Methods ─────────────────────────────────────────────────────────────────────

	const createVariant = async (
		productId: string,
		payload: Omit<Variant, 'variantId'>,
	) => {
		const updated = await addVariant(productId, payload);
		syncProduct(updated);
	};

	const editVariant = async (
		productId: string,
		variantId: string,
		payload: Omit<Variant, 'variantId'>,
	) => {
		const updated = await updateVariant(productId, variantId, payload);
		syncProduct(updated);
	};

	const removeVariant = async (productId: string, variantId: string) => {
		const updated = await deleteVariant(productId, variantId);
		syncProduct(updated);
	};

	return {
		brandMap,
		categoryMap,
		brands,
		categories,
		products,
		isLoading,
		error,
		removeProduct,
		addProduct,
		editProduct,
		createVariant,
		editVariant,
		removeVariant,
	};
};

export default useProducts;
