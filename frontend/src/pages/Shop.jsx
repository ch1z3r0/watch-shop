import { useAuth } from '../auth/AuthProvider';
import FullScreenLoader from '../components/FullScreenLoader';
import './Shop.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFavourites } from '../context/FavouritesContext';
import useShopFilters from '../hooks/useShopFilters';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const getLowestPrice = (variants) => {
	if (!variants || variants.length === 0) return null;
	return Math.min(...variants.map((v) => v.price));
};

const getFirstImage = (variants) => {
	for (const v of variants || []) {
		if (v.images && v.images.length > 0) return v.images[0];
	}
	return null;
};

const SORT_OPTIONS = [
	{ value: 'featured', label: 'Featured' },
	{ value: 'newest', label: 'Newest First' },
	{ value: 'price-asc', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'name-asc', label: 'Name: A → Z' },
	{ value: 'name-desc', label: 'Name: Z → A' },
];

const SortDropdown = ({ value, onChange }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selected = SORT_OPTIONS.find((o) => o.value === value);

	return (
		<div className='sort-dropdown' ref={ref}>
			<button
				className={`sort-dropdown__trigger ${open ? 'is-open' : ''}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				<span>{selected?.label}</span>
				<span className='sort-dropdown__arrow'>▼</span>
			</button>

			{open && (
				<div className='sort-dropdown__menu'>
					{SORT_OPTIONS.map((opt) => (
						<div
							key={opt.value}
							className={`sort-dropdown__option ${value === opt.value ? 'is-selected' : ''}`}
							onClick={() => {
								onChange(opt.value);
								setOpen(false);
							}}
						>
							{opt.label}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const ProductCard = ({ product, onClick }) => {
	const { isFavourite, addFavourite, removeFavourite } = useFavourites();
	const isFav = isFavourite(product._id);

	const handleFavClick = (e) => {
		e.stopPropagation();
		isFav ? removeFavourite(product._id) : addFavourite(product);
	};

	const lowestPrice = getLowestPrice(product.variants);
	const image = getFirstImage(product.variants);
	const inStock = product.variants?.some((v) => v.stock > 0);
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className={`product-card ${hovered ? 'product-card--hovered' : ''}`}
			onClick={onClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div className='product-card__image-wrap'>
				{image ? (
					<img src={image} alt={product.name} className='product-card__image' />
				) : (
					<div className='product-card__image-placeholder'>
						<svg
							viewBox='0 0 80 80'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<rect
								x='20'
								y='10'
								width='40'
								height='60'
								rx='12'
								stroke='rgba(255,255,255,0.2)'
								strokeWidth='2'
							/>
							<circle
								cx='40'
								cy='40'
								r='14'
								stroke='rgba(255,255,255,0.15)'
								strokeWidth='2'
							/>
							<circle cx='40' cy='40' r='8' fill='rgba(255,255,255,0.08)' />
							<rect
								x='36'
								y='4'
								width='8'
								height='8'
								rx='2'
								fill='rgba(255,255,255,0.15)'
							/>
							<rect
								x='36'
								y='68'
								width='8'
								height='8'
								rx='2'
								fill='rgba(255,255,255,0.15)'
							/>
						</svg>
					</div>
				)}
				<button
					className={`product-card__heart ${isFav ? 'is-fav' : ''}`}
					onClick={handleFavClick}
					aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
				>
					{isFav ? '♥' : '♡'}
				</button>
				{!inStock && (
					<span className='product-card__badge product-card__badge--out'>
						Out of Stock
					</span>
				)}
				{product.variants?.some((v) => v.featured) && inStock && (
					<span className='product-card__badge product-card__badge--featured'>
						Featured
					</span>
				)}
			</div>

			<div className='product-card__body'>
				<p className='product-card__brand'>{product.brandId}</p>
				<h3 className='product-card__name'>{product.name}</h3>

				<div className='product-card__variants'>
					{product.variants?.slice(0, 4).map((v) => (
						<span
							key={v.variantId}
							className='product-card__color-dot'
							style={{ background: v.color.toLowerCase() }}
							title={v.color}
						/>
					))}
					{product.variants?.length > 4 && (
						<span className='product-card__more-variants'>
							+{product.variants.length - 4}
						</span>
					)}
				</div>

				<div className='product-card__footer'>
					<span className='product-card__price'>
						{lowestPrice !== null ? `From ${formatPrice(lowestPrice)}` : '—'}
					</span>
				</div>
			</div>
		</div>
	);
};

const Shop = () => {
	const { isLoading } = useAuth();
	const [products, setProducts] = useState([]);
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const {
		filtered,
		search,
		setSearch,
		sort,
		setSort,
		selectedBrands,
		setSelectedBrands,
		selectedCategories,
		setSelectedCategories,
		maxPrice,
		setMaxPrice,
		inStock,
		setInStock,
		railOpen,
		setRailOpen,
		activeChips: rawChips,
		toggle,
		clearAll,
		PRICE_MAX,
	} = useShopFilters(products);

	const activeChips = rawChips.map((chip) => {
		const brand = brands.find((b) => b.brandId === chip.label);
		if (brand) return { ...chip, label: brand.name };

		const category = categories.find((c) => c.categoryId === chip.label);
		if (category) return { ...chip, label: category.name };

		return chip;
	});

	useEffect(() => {
		const fetchData = async () => {
			setFetching(true);
			setError(null);
			try {
				const [productsRes, brandsRes, categoriesRes] = await Promise.all([
					axios.get(`${API_BASE}/api/products`),
					axios.get(`${API_BASE}/api/brands`),
					axios.get(`${API_BASE}/api/categories`),
				]);
				setProducts(productsRes.data);
				setBrands(brandsRes.data);
				setCategories(categoriesRes.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setFetching(false);
			}
		};
		fetchData();
	}, []);

	if (isLoading) return <FullScreenLoader message='Checking your session...' />;

	return (
		<div className='shop'>
			<div className='bg1'></div>

			<div className='shop-wrapper'>
				<div className='shop-hero'>
					<h1 className='shop-title'>Pick Your Favorites</h1>
					<p className='shop-subtitle'>Explore the world's finest timepieces</p>
				</div>

				<div className='shop-controls'>
					<div className='shop-topbar'>
						<button
							className='shop-filter-btn'
							onClick={() => setRailOpen(true)}
						>
							Filters {activeChips.length > 0 && `(${activeChips.length})`}
						</button>

						<div className='shop-search-wrap'>
							<svg className='search-icon' viewBox='0 0 20 20' fill='none'>
								<circle
									cx='9'
									cy='9'
									r='6'
									stroke='currentColor'
									strokeWidth='1.5'
								/>
								<path
									d='M14 14l3 3'
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
								/>
							</svg>
							<input
								type='text'
								className='shop-search'
								placeholder='Search watches…'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							{search && (
								<button className='search-clear' onClick={() => setSearch('')}>
									✕
								</button>
							)}
						</div>

						<SortDropdown value={sort} onChange={setSort} />
					</div>

					{activeChips.length > 0 && (
						<div className='shop-chips'>
							{activeChips.map((chip, i) => (
								<button key={i} className='shop-chip' onClick={chip.clear}>
									{chip.label} ✕
								</button>
							))}
							<button className='shop-chip-clear' onClick={clearAll}>
								Clear all
							</button>
						</div>
					)}
				</div>
				<div className='shop__layout'>
					{/* Filter rail — desktop sidebar / mobile drawer */}
					<aside className={`shop__rail ${railOpen ? 'is-open' : ''}`}>
						<div className='shop__rail-head'>
							<span>Filters</span>
							<button
								className='shop__rail-close'
								onClick={() => setRailOpen(false)}
							>
								✕
							</button>
						</div>

						{/* Brands */}
						<div className='shop__filter-group'>
							<p className='shop__filter-label'>Brand</p>
							{brands.map((brand) => (
								<label key={brand.brandId} className='shop__check-row'>
									<input
										type='checkbox'
										checked={selectedBrands.includes(brand.brandId)}
										onChange={() => toggle(setSelectedBrands, brand.brandId)}
									/>
									<span className='shop__check-label'>{brand.name}</span>
									<span className='shop__check-count'>
										{brand.productCount ?? ''}
									</span>
								</label>
							))}
						</div>

						{/* Categories */}
						<div className='shop__filter-group'>
							<p className='shop__filter-label'>Category</p>
							{categories.map((cat) => (
								<label key={cat.categoryId} className='shop__check-row'>
									<input
										type='checkbox'
										checked={selectedCategories.includes(cat.categoryId)}
										onChange={() =>
											toggle(setSelectedCategories, cat.categoryId)
										}
									/>
									<span className='shop__check-label'>{cat.name}</span>
									<span className='shop__check-count'>
										{cat.productCount ?? ''}
									</span>
								</label>
							))}
						</div>

						{/* Price range */}
						<div className='shop__filter-group'>
							<p className='shop__filter-label'>Price</p>
							<div className='shop__price-readout'>
								<span>$0</span>
								<span className='shop__price-val'>Up to ${maxPrice}</span>
							</div>
							<input
								type='range'
								className='shop__price-range'
								min={0}
								max={PRICE_MAX}
								value={maxPrice}
								onChange={(e) => setMaxPrice(Number(e.target.value))}
							/>
							<div className='shop__price-presets'>
								{[200, 400, 600, PRICE_MAX].map((p) => (
									<button
										key={p}
										className={`shop__price-chip ${maxPrice === p ? 'is-active' : ''}`}
										onClick={() => setMaxPrice(p)}
									>
										{p === PRICE_MAX ? 'Any' : `< $${p}`}
									</button>
								))}
							</div>
						</div>

						{/* In stock */}
						<div className='shop__filter-group'>
							<p className='shop__filter-label'>Availability</p>
							<label className='shop__check-row'>
								<input
									type='checkbox'
									checked={inStock}
									onChange={() => setInStock((prev) => !prev)}
								/>
								<span className='shop__check-label'>In stock only</span>
							</label>
						</div>

						{activeChips.length > 0 && (
							<button className='shop__rail-clear' onClick={clearAll}>
								Clear all filters
							</button>
						)}
					</aside>

					{/* Overlay for mobile — closes rail when clicking outside */}
					{railOpen && (
						<div className='shop__overlay' onClick={() => setRailOpen(false)} />
					)}
					<div className='shop-content'>
						{fetching ? (
							<div className='shop-state'>
								<div className='shop-spinner' />
								<p>Loading watches…</p>
							</div>
						) : error ? (
							<div className='shop-state shop-state--error'>
								<svg
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.5'
									width='48'
									height='48'
								>
									<circle cx='12' cy='12' r='10' />
									<line x1='12' y1='8' x2='12' y2='12' />
									<line x1='12' y1='16' x2='12.01' y2='16' />
								</svg>
								<p>Couldn't load products. Is the backend running?</p>
								<code>{error}</code>
							</div>
						) : filtered.length === 0 ? (
							<div className='shop-state'>
								<svg viewBox='0 0 80 80' fill='none' width='80' height='80'>
									<circle
										cx='40'
										cy='40'
										r='36'
										stroke='rgba(255,255,255,0.1)'
										strokeWidth='2'
									/>
									<path
										d='M28 40h24M40 28v24'
										stroke='rgba(255,255,255,0.2)'
										strokeWidth='2'
										strokeLinecap='round'
									/>
								</svg>
								<p>No watches found{search ? ` for "${search}"` : ''}.</p>
								{search && (
									<button
										className='shop-reset-btn'
										onClick={() => setSearch('')}
									>
										Clear Search
									</button>
								)}
							</div>
						) : (
							<>
								<p className='shop-count'>
									{filtered.length} watch{filtered.length !== 1 ? 'es' : ''}
								</p>
								<div className='product-grid'>
									{filtered.map((product) => (
										<ProductCard
											key={product.productId}
											product={product}
											onClick={() => navigate(`/product/${product.slug}`)}
										/>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;
