import { useEffect, useMemo, useState } from 'react';
import { Product, Variant } from '../types/product';
import { getProducts, deleteProduct } from '../api/productApi';
import { Brand } from '../types/brand';
import { getBrands } from '../api/brandApi';
import { Category } from '../types/category';
import { getCategories } from '../api/categoryApi';

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

	return { brandMap, categoryMap, products, isLoading, error, removeProduct };
};

export default useProducts;
