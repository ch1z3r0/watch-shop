import { useAuth } from '../auth/AuthProvider';
import FullScreenLoader from '../components/FullScreenLoader';
import Navigation from '../components/Navigation/Navigation';
import './Shop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-0f2939e7cf/icons';
import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const tabs = [
	{
		id: 1,
		name: 'New & Featured',
		icon: 'star',
		prefix: 'far',
		brandSlug: null,
	},
	{
		id: 2,
		name: 'Samsung',
		icon: 'stripe-s',
		prefix: 'fab',
		brandSlug: 'samsung',
	},
	{ id: 3, name: 'Apple', icon: 'apple', prefix: 'fab', brandSlug: 'apple' },
	{ id: 4, name: 'Google', icon: 'google', prefix: 'fab', brandSlug: 'google' },
];

const SORT_OPTIONS = [
	{ value: 'newest', label: 'Newest First' },
	{ value: 'price-asc', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'name-asc', label: 'Name: A–Z' },
];

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

const ProductCard = ({ product, onAddToCart }) => {
	const lowestPrice = getLowestPrice(product.variants);
	const image = getFirstImage(product.variants);
	const inStock = product.variants?.some((v) => v.stock > 0);
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className={`product-card ${hovered ? 'product-card--hovered' : ''}`}
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
					<button
						className='product-card__cta'
						disabled={!inStock}
						onClick={() => onAddToCart(product)}
					>
						{inStock ? 'Add to Cart' : 'Unavailable'}
					</button>
				</div>
			</div>
		</div>
	);
};

const Shop = () => {
	const { user, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState('New & Featured');
	const [products, setProducts] = useState([]);
	const [brands, setBrands] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState('newest');
	const [cartCount, setCartCount] = useState(0);
	const [cartFlash, setCartFlash] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setFetching(true);
			setError(null);
			try {
				const [productsRes, brandsRes] = await Promise.all([
					fetch(`${API_BASE}/api/products`),
					fetch(`${API_BASE}/api/brands`),
				]);
				if (!productsRes.ok) throw new Error('Failed to fetch products');
				const productsData = await productsRes.json();
				setProducts(productsData);

				if (brandsRes.ok) {
					const brandsData = await brandsRes.json();
					setBrands(brandsData);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setFetching(false);
			}
		};
		fetchData();
	}, []);

	const handleAddToCart = useCallback((product) => {
		setCartCount((c) => c + 1);
		setCartFlash(true);
		setTimeout(() => setCartFlash(false), 600);
	}, []);

	const activeTabData = tabs.find((t) => t.name === activeTab);

	const filtered = products
		.filter((p) => {
			if (activeTabData?.brandSlug) {
				const matchingBrand = brands.find(
					(b) => b.name?.toLowerCase() === activeTabData.brandSlug,
				);
				if (matchingBrand && p.brandId !== matchingBrand.brandId) return false;
			}
			if (search.trim()) {
				return p.name.toLowerCase().includes(search.toLowerCase());
			}
			if (activeTab === 'New & Featured') {
				const hasFeatured = p.variants?.some((v) => v.featured);
				return hasFeatured;
			}
			return true;
		})
		.sort((a, b) => {
			if (sort === 'price-asc')
				return getLowestPrice(a.variants) - getLowestPrice(b.variants);
			if (sort === 'price-desc')
				return getLowestPrice(b.variants) - getLowestPrice(a.variants);
			if (sort === 'name-asc') return a.name.localeCompare(b.name);
			// newest: rely on server order (createdAt desc)
			return 0;
		});

	if (isLoading) return <FullScreenLoader message='Checking your session...' />;

	return (
		<div className='shop'>
			<div className='bg1'></div>
			<Navigation />

			<div className='shop-wrapper'>
				<div className='shop-hero'>
					<h1 className='shop-title'>Pick Your Favorites</h1>
					<p className='shop-subtitle'>Explore the world's finest timepieces</p>
				</div>

				<div className='shop-controls'>
					<div className='shop-tab'>
						<div className='shop-tab-list'>
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={activeTab === tab.name ? 'is-active' : ''}
									onClick={() => {
										setActiveTab(tab.name);
										setSearch('');
									}}
								>
									<span className='tab-icon'>
										<FontAwesomeIcon
											icon={byPrefixAndName[tab.prefix][tab.icon]}
										/>
									</span>
									<span>{tab.name}</span>
								</button>
							))}
						</div>
					</div>

					<div className='shop-filters'>
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

						<select
							className='shop-sort'
							value={sort}
							onChange={(e) => setSort(e.target.value)}
						>
							{SORT_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>

						<button
							className={`cart-btn ${cartFlash ? 'cart-btn--flash' : ''}`}
						>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.8'
							>
								<path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z' />
								<line x1='3' y1='6' x2='21' y2='6' />
								<path d='M16 10a4 4 0 01-8 0' />
							</svg>
							{cartCount > 0 && <span className='cart-count'>{cartCount}</span>}
						</button>
					</div>
				</div>

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
										onAddToCart={handleAddToCart}
									/>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Shop;
