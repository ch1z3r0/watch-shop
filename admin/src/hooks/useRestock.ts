import { useEffect, useMemo, useState } from 'react';
import { Product } from '../types/product';
import { getProducts, restockVariant } from '../api/productApi';

// --- Search, Filters, Sort types -------------------------------------------
export interface Filters {
	stock: 'all' | 'lowstock' | 'outofstock';
}

type SortColumn = 'productName' | 'stock';
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
	const [sort, setSort] = useState<Sort>({
		column: 'productName',
		direction: 'asc',
	});

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

	const flatVariants = useMemo(
		() =>
			products.flatMap((product) =>
				product.variants.map((variant) => ({
					...variant,
					productId: product.productId,
					productName: product.name,
				})),
			),
		[products],
	);

	const filteredVariants = useMemo(() => {
		let result = [...flatVariants];

		// --- Search ---------------------------------------------------------------
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();

			result = result.filter((v) => {
				return (
					v.productName.toLowerCase().includes(q) ||
					v.color.toLowerCase().includes(q)
				);
			});
		}

		// --- Filters ---------------------------------------------------------------
		if (filters.stock === 'lowstock') {
			result = result.filter((v) => v.stock < 10 && v.stock > 0);
		} else if (filters.stock === 'outofstock') {
			result = result.filter((v) => v.stock === 0);
		}

		// --- Sort --------------------------------------------------------------------
		result.sort((a, b) => {
			let valA: number | string = 0;
			let valB: number | string = 0;

			if (sort.column === 'productName') {
				valA = a.productName.toLowerCase();
				valB = b.productName.toLowerCase();
			} else if (sort.column === 'stock') {
				valA = a.stock;
				valB = b.stock;
			}
			if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
			return 0;
		});
		return result;
	}, [flatVariants, searchQuery, filters, sort]);

	// ─── Methods ─────────────────────────────────────────────────────────────────────
	const restockProductVariant = async (
		productId: string,
		variantId: string,
		quantity: number,
	) => {
		const updated = await restockVariant(productId, variantId, quantity);
		setProducts((prev) =>
			prev.map((p) => (p.productId === productId ? updated : p)),
		);
	};

	return {
		products,
		isLoading,
		error,
		filteredVariants,
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
