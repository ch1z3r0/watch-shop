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
// --- Search, Filters, Sort types -------------------------------------------
export interface Filters {
	brandId: string;
	categoryId: string;
	stock: 'all' | 'instock' | 'lowstock' | 'outofstock';
}

type SortColumn = 'name' | 'stock' | 'price' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';
export interface Sort {
	column: SortColumn;
	direction: SortDirection;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [brands, setBrands] = useState<Brand[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [filters, setFilters] = useState<Filters>({
		brandId: '',
		categoryId: '',
		stock: 'all',
	});
	const [sort, setSort] = useState<Sort>({ column: 'name', direction: 'asc' });

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

	const filteredProducts = useMemo(() => {
		let result = [...products];

		// --- Search ---------------------------------------------------------------
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter((p) => {
				const brandName = brandMap[p.brandId]?.toLowerCase() ?? '';
				const categoryName = categoryMap[p.categoryId]?.toLowerCase() ?? '';
				const variantFields = p.variants
					.flatMap((v) => [v.color, v.case, ...v.mode])
					.join(' ')
					.toLowerCase();
				return (
					p.name.toLowerCase().includes(q) ||
					brandName.includes(q) ||
					categoryName.includes(q) ||
					variantFields.includes(q)
				);
			});
		}

		// --- Filters ---------------------------------------------------------------
		if (filters.brandId) {
			result = result.filter((p) => p.brandId === filters.brandId);
		}
		if (filters.categoryId) {
			result = result.filter((p) => p.categoryId === filters.categoryId);
		}
		if (filters.stock !== 'all') {
			result = result.filter((p) => {
				const total = getTotalStock(p.variants ?? []);
				if (filters.stock === 'outofstock') return total === 0;
				if (filters.stock === 'lowstock') return total > 0 && total < 10;
				if (filters.stock === 'instock') return total >= 10;
				return true;
			});
		}

		// --- Sort --------------------------------------------------------------------
		result.sort((a, b) => {
			let valA: number | string = 0;
			let valB: number | string = 0;

			if (sort.column === 'name') {
				valA = a.name.toLowerCase();
				valB = b.name.toLowerCase();
			} else if (sort.column === 'stock') {
				valA = getTotalStock(a.variants ?? []);
				valB = getTotalStock(b.variants ?? []);
			} else if (sort.column === 'price') {
				valA = Math.min(...(a.variants ?? []).map((v) => v.price));
				valB = Math.min(...(b.variants ?? []).map((v) => v.price));
			} else if (sort.column === 'createdAt') {
				valA = new Date(a.createdAt).getDate();
				valB = new Date(b.createdAt).getDate();
			} else if (sort.column === 'updatedAt') {
				valA = new Date(a.updatedAt).getTime();
				valB = new Date(b.updatedAt).getTime();
			}
			if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
			return 0;
		});
		return result;
	}, [products, searchQuery, filters, sort, brandMap, categoryMap]);

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
		filteredProducts,
		filters,
		setFilters,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		removeProduct,
		addProduct,
		editProduct,
		createVariant,
		editVariant,
		removeVariant,
	};
};

export default useProducts;
