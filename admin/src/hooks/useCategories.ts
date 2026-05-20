import { useEffect, useMemo, useState } from 'react';

import { Category } from '../types/category';
import {
	createCategory,
	deleteCategory,
	getCategories,
	updateCategory,
} from '../api/categoryApi';

// ─── Helper functions ─────────────────────────────────────────────────────────

// --- Search, Sort types -------------------------------------------

type SortColumn = 'name' | 'productCount' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';
export interface Sort {
	column: SortColumn;
	direction: SortDirection;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useCategories = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [sort, setSort] = useState<Sort>({ column: 'name', direction: 'asc' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [categoryData] = await Promise.all([getCategories()]);
				setCategories(categoryData);
			} catch (error) {
				console.error(error);
				setError('Failed to fetch categories');
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const filteredCategories = useMemo(() => {
		let result = [...categories];

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
	}, [searchQuery, sort, categories]);

	// Replaces one category in state with the updated version returned by the backend
	const syncCategory = (updated: Category) =>
		setCategories((prev) =>
			prev.map((c) => (c.categoryId === updated.categoryId ? updated : c)),
		);
	// ─── Category Methods ─────────────────────────────────────────────────────────────────────

	const addCategory = async (payload: { name: string; slug: string }) => {
		const createdCategory = await createCategory(payload);
		setCategories((prev) => [createdCategory, ...prev]);
	};

	const editCategory = async (
		categoryId: string,
		payload: {
			name: string;
			slug: string;
		},
	) => {
		await updateCategory(categoryId, payload);
		setCategories((prev) =>
			prev.map((c) => (c.categoryId === categoryId ? { ...c, ...payload } : c)),
		);
	};
	const removeCategory = async (categoryId: string) => {
		await deleteCategory(categoryId);
		setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId));
	};

	return {
		filteredCategories,
		syncCategory,
		categories,
		isLoading,
		error,
		sort,
		setSort,
		searchQuery,
		setSearchQuery,
		removeCategory,
		addCategory,
		editCategory,
	};
};

export default useCategories;
