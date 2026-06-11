import { useMemo, useState } from 'react';

const PRICE_MAX = 900;

const useShopFilters = (products) => {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('featured');
	const [selectedBrands, setSelectedBrands] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
	const [inStock, setInStock] = useState(false);
	const [railOpen, setRailOpen] = useState(false);

	// --- Helpers ------------------------------------------------------------------
	const toggle = (setList, value) => {
		setList((prev) =>
			prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
		);
	};

	const clearAll = () => {
		setSearch('');
		setSelectedBrands([]);
		setSelectedCategories([]);
		setMaxPrice(PRICE_MAX);
		setInStock(false);
	};

	// --- Methods ------------------------------------------------------------------
	const getLowestPrice = (variants) => {
		if (!variants || variants.length === 0) return 0;
		return Math.min(...variants.map((v) => v.price));
	};

	const filtered = useMemo(() => {
		return products
			.filter((p) => {
				if (
					search.trim() &&
					!p.name.toLowerCase().includes(search.toLowerCase())
				)
					return false;
				if (selectedBrands.length && !selectedBrands.includes(p.brandId))
					return false;
				if (
					selectedCategories.length &&
					!selectedCategories.includes(p.categoryId)
				)
					return false;
				if (getLowestPrice(p.variants) > maxPrice) return false;
				if (inStock && !p.variants?.some((v) => v.stock > 0)) return false;
				return true;
			})
			.sort((a, b) => {
				if (sort === 'featured') {
					const aFeatured = a.variants?.some((v) => v.featured) ? 1 : 0;
					const bFeatured = b.variants?.some((v) => v.featured) ? 1 : 0;
					return bFeatured - aFeatured;
				}
				if (sort === 'newest')
					return new Date(b.createdAt) - new Date(a.createdAt);
				if (sort === 'price-asc')
					return getLowestPrice(a.variants) - getLowestPrice(b.variants);
				if (sort === 'price-desc')
					return getLowestPrice(b.variants) - getLowestPrice(a.variants);
				if (sort === 'name-asc') return a.name.localeCompare(b.name);
				if (sort === 'name-desc') return b.name.localeCompare(a.name);
				return 0;
			});
	}, [
		sort,
		search,
		selectedBrands,
		selectedCategories,
		inStock,
		maxPrice,
		products,
	]);

	const activeChips = [
		...selectedBrands.map((id) => ({
			label: id,
			clear: () => {
				toggle(setSelectedBrands, id);
			},
		})),
		...selectedCategories.map((id) => ({
			label: id,
			clear: () => {
				toggle(setSelectedCategories, id);
			},
		})),
		...(maxPrice < PRICE_MAX
			? [{ label: `Under $${maxPrice}`, clear: () => setMaxPrice(PRICE_MAX) }]
			: []),
		...(inStock
			? [{ label: 'In stock only', clear: () => setInStock(false) }]
			: []),
		...(search.trim()
			? [{ label: `"${search}"`, clear: () => setSearch('') }]
			: []),
	];

	return {
		filtered,
		clearAll,
		PRICE_MAX,
		toggle,
		activeChips,
		selectedBrands,
		setSelectedBrands,
		selectedCategories,
		setSelectedCategories,
		search,
		setSearch,
		sort,
		setSort,
		inStock,
		setInStock,
		maxPrice,
		setMaxPrice,
		railOpen,
		setRailOpen,
	};
};

export default useShopFilters;
