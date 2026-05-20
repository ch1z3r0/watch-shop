import { useEffect, useMemo, useState } from 'react';

import { Brand } from '../types/brand';
import {
	createBrand,
	deleteBrand,
	getBrands,
	updateBrand,
} from '../api/brandApi';

// ─── Helper functions ─────────────────────────────────────────────────────────

// --- Search, Sort types -------------------------------------------

type SortColumn = 'name' | 'productCount' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';
export interface Sort {
	column: SortColumn;
	direction: SortDirection;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useBrands = () => {
	const [brands, setBrands] = useState<Brand[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [sort, setSort] = useState<Sort>({ column: 'name', direction: 'asc' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [brandData] = await Promise.all([getBrands()]);
				setBrands(brandData);
			} catch (error) {
				console.error(error);
				setError('Failed to fetch brands');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredBrands = useMemo(() => {
		let result = [...brands];

		// --- Search ---------------------------------------------------------------
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter((c) => {
				return c.name.toLowerCase().includes(q);
			});
		}

		// --- Sort --------------------------------------------------------------------
		result.sort((a, b) => {
			let valA: number | string = 0;
			let valB: number | string = 0;

			if (sort.column === 'name') {
				valA = a.name.toLowerCase();
				valB = b.name.toLowerCase();
			} else if (sort.column === 'productCount') {
				valA = a.productCount;
				valB = b.productCount;
			} else if (sort.column === 'createdAt') {
				valA = new Date(a.createdAt).getTime();
				valB = new Date(b.createdAt).getTime();
			} else if (sort.column === 'updatedAt') {
				valA = new Date(a.updatedAt).getTime();
				valB = new Date(b.updatedAt).getTime();
			}
			if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
			if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
			return 0;
		});
		return result;
	}, [searchQuery, sort, brands]);

	// Replaces one brand in state with the updated version returned by the backend
	const syncBrand = (updated: Brand) =>
		setBrands((prev) =>
			prev.map((b) => (b.brandId === updated.brandId ? updated : b)),
		);
	// ─── Brand Methods ─────────────────────────────────────────────────────────────────────

	const addBrand = async (payload: { name: string; slug: string }) => {
		const createdBrand = await createBrand(payload);
		setBrands((prev) => [createdBrand, ...prev]);
	};

	const editBrand = async (
		brandId: string,
		payload: {
			name: string;
			slug: string;
		},
	) => {
		await updateBrand(brandId, payload);
		setBrands((prev) =>
			prev.map((b) => (b.brandId === brandId ? { ...b, ...payload } : b)),
		);
	};
	const removeBrand = async (brandId: string) => {
		await deleteBrand(brandId);
		setBrands((prev) => prev.filter((b) => b.brandId !== brandId));
	};

	return {
		filteredBrands,
		syncBrand,
		brands,
		isLoading,
		error,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		removeBrand,
		addBrand,
		editBrand,
	};
};

export default useBrands;
