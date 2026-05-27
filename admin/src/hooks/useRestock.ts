import { useEffect, useMemo, useState } from 'react';
import { Product, Variant } from '../types/product';
import { getProducts, restockVariant } from '../api/productApi';

// ─── Helper functions ─────────────────────────────────────────────────────────

export const getTotalStock = (variants: Variant[]): number =>
	variants.reduce((sum, v) => sum + v.stock, 0);

// --- Search, Filters, Sort types -------------------------------------------
export interface Filters {
	stock: 'all' | 'lowstock' | 'outofstock';
}

type SortColumn = 'name' | 'stock';
type SortDirection = 'asc' | 'desc';
export interface Sort {
	column: SortColumn;
	direction: SortDirection;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useRestock = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [filters, setFilters] = useState<Filters>({
		stock: 'all',
	});
	const [sort, setSort] = useState<Sort>({ column: 'name', direction: 'asc' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const productsData = await getProducts();
				setProducts(productsData);
			} catch (error) {
				console.error(error);
				setError('Failed to fetch products');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredProducts = useMemo(() => {
		let result = [...products];

		// --- Search ---------------------------------------------------------------
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter((p) => {
				const variantFields = p.variants
					.flatMap((v) => [v.color, v.case, ...v.mode])
					.join(' ')
					.toLowerCase();
				return p.name.toLowerCase().includes(q) || variantFields.includes(q);
			});
		}

		// --- Filters ---------------------------------------------------------------
		if (filters.stock !== 'all') {
			result = result.filter((p) => {
				const total = getTotalStock(p.variants ?? []);
				if (filters.stock === 'outofstock') return total === 0;
				if (filters.stock === 'lowstock') return total > 0 && total < 10;
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
			}
			if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
			return 0;
		});
		return result;
	}, [products, searchQuery, filters, sort]);

	// Replaces one product in state with the updated version returned by the backend
	const syncProduct = (updated: Product) =>
		setProducts((prev) =>
			prev.map((p) => (p.productId === updated.productId ? updated : p)),
		);
	// ─── Methods ─────────────────────────────────────────────────────────────────────
	const restockProductVariant = async (
		productId: string,
		variantId: string,
		quantity: number,
	) => {
		const updated = await restockVariant(productId, variantId, quantity);
		syncProduct(updated);
	};

	return {
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
		restockProductVariant,
	};
};

export default useRestock;
