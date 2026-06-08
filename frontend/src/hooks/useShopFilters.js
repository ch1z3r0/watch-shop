import { useMemo, useState } from 'react';

const PRICE_MAX = 900;

const useShopFilters = () => {
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('featured');
	const [selectedBrands, setSelectedBrand] = useState([]);
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
		setSelectedBrand([]);
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
		return products.filter((p) => {});
	}, []);

	return <div>useShopFilters</div>;
};

export default useShopFilters;
