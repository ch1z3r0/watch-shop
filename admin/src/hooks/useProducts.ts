import { useEffect, useMemo, useState } from 'react';
import { Product } from '../types/product';
import { getProducts } from '../api/productApi';
import { Brand } from '../types/brand';
import { getBrands } from '../api/brandApi';
import { Category } from '../types/category';
import { getCategories } from '../api/categoryApi';

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

	return { brandMap, categoryMap, products, isLoading, error };
};

export default useProducts;
