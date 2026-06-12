import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useFavourites } from '../context/FavouritesContext';
import './ProductDetail.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const ProductDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isFavourite, addFavourite, removeFavourite } = useFavourites();

	// ── Server state ──
	const [product, setProduct] = useState(null);
	const [brands, setBrands] = useState([]);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [error, setError] = useState(null);

	// ── Selection state ──
	const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
	const [selectedImageIdx, setSelectedImageIdx] = useState(0);
	const [qty, setQty] = useState(1);

	// ── Derived from selection ──
	const variant = product?.variants?.[selectedVariantIdx];
	const isFav = product ? isFavourite(product._id) : false;
	const inStock = variant?.stock > 0;

	useEffect(() => {
		const fetchProduct = async () => {
			setFetching(true);
			setError(null);
			setSelectedVariantIdx(0);
			setSelectedImageIdx(0);
			setQty(1);
			try {
				const [productRes, brandsRes] = await Promise.all([
					axios.get(`${API_BASE}/api/products/slug/${slug}`),
					axios.get(`${API_BASE}/api/brands`),
				]);
				setProduct(productRes.data);
				setBrands(brandsRes.data);

				// Fetch related products from same brand
				const allProductsRes = await axios.get(`${API_BASE}/api/products`);
				const related = allProductsRes.data
					.filter(
						(p) =>
							p.brandId === productRes.data.brandId &&
							p._id !== productRes.data._id,
					)
					.slice(0, 4);
				setRelatedProducts(related);
			} catch (err) {
				setError(err.message);
			} finally {
				setFetching(false);
			}
		};
		fetchProduct();
	}, [slug]);

	const handleVariantSelect = (idx) => {
		setSelectedVariantIdx(idx);
		setSelectedImageIdx(0); // reset to first image of new variant
		setQty(1); // reset quantity when switching variant
	};

	const handleFavClick = () => {
		if (!product) return;
		isFav ? removeFavourite(product._id) : addFavourite(product);
	};

	const handleQtyChange = (delta) => {
		setQty((prev) => {
			const next = prev + delta;
			if (next < 1) return 1;
			if (variant && next > variant.stock) return variant.stock;
			return next;
		});
	};

	const handleAddToCart = () => {
		if (!product || !variant || !inStock) return;
		// CartContext wiring goes here once built
		console.log('Add to cart:', { product, variant, qty });
	};

	if (fetching) {
		return (
			<div className='pd-state'>
				<div className='pd-spinner' />
				<p>Loading product…</p>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className='pd-state'>
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
				<p>Product not found.</p>
				<button className='pd-back-btn' onClick={() => navigate('/shop')}>
					Back to Shop
				</button>
			</div>
		);
	}

	const brandName =
		brands.find((b) => b.brandId === product.brandId)?.name || product.brandId;

	// Get unique colors and sizes across all variants
	const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
	const uniqueSizes = [...new Set(product.variants.map((v) => v.size))].sort(
		(a, b) => a - b,
	);

	const findVariantIndex = (color, size) => {
		const exactMatch = product.variants.findIndex(
			(v) => v.color === color && v.size === size,
		);
		if (exactMatch !== -1) return exactMatch;
		// Fallback: match color only
		const colorMatch = product.variants.findIndex((v) => v.color === color);
		return colorMatch !== -1 ? colorMatch : 0;
	};
	const isSizeAvailable = (size, color) => {
		return product.variants.some((v) => v.color === color && v.size === size);
	};

	const handleColorSelect = (color) => {
		const idx = findVariantIndex(color, variant.size);
		handleVariantSelect(idx);
	};

	const handleSizeSelect = (size) => {
		const idx = findVariantIndex(variant.color, size);
		handleVariantSelect(idx);
	};

	return (
		<div className='pd'>
			{/* Breadcrumbs */}
			<div className='pd__crumbs'>
				<Link to='/shop'>Shop</Link>
				<span>/</span>
				<span className='pd__crumbs-brand'>{brandName}</span>
				<span>/</span>
				<span className='pd__crumbs-current'>{product.name}</span>
			</div>
			<div className='pd__main'>
				{/* Gallery */}
				<div className='pd__gallery'>
					<div className='pd__stage'>
						{variant?.images?.[selectedImageIdx] ? (
							<img
								src={variant.images[selectedImageIdx]}
								alt={product.name}
								className='pd__stage-img'
							/>
						) : (
							<div className='pd__stage-placeholder'>No image</div>
						)}
						{variant?.featured && (
							<span className='pd__badge pd__badge--featured'>Featured</span>
						)}
					</div>

					{variant?.images?.length > 1 && (
						<div className='pd__thumbs'>
							{variant.images.map((img, i) => (
								<button
									key={i}
									className={`pd__thumb ${i === selectedImageIdx ? 'is-active' : ''}`}
									onClick={() => setSelectedImageIdx(i)}
								>
									<img src={img} alt={`View ${i + 1}`} />
								</button>
							))}
						</div>
					)}
				</div>

				{/* Buy box */}
				<div className='pd__buybox'>
					<div className='pd__buybox-top'>
						<p className='pd__brand'>{brandName}</p>
						<button
							className={`pd__heart ${isFav ? 'is-fav' : ''}`}
							onClick={handleFavClick}
							aria-label={
								isFav ? 'Remove from favourites' : 'Add to favourites'
							}
						>
							{isFav ? '♥' : '♡'}
						</button>
					</div>

					<h1 className='pd__name'>{product.name}</h1>

					<div className='pd__price-row'>
						<span className='pd__price'>
							{formatPrice(variant?.price ?? 0)}
						</span>
					</div>

					<p className={`pd__stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
						{inStock ? `● In stock (${variant.stock} units)` : '● Out of stock'}
					</p>

					{/* Color */}
					<div className='pd__option'>
						<div className='pd__option-head'>
							<span className='pd__option-label'>Color</span>
							<span className='pd__option-value'>{variant.color}</span>
						</div>
						<div className='pd__swatches'>
							{uniqueColors.map((color) => {
								const colorVariant = product.variants.find(
									(v) => v.color === color,
								);
								return (
									<button
										key={color}
										className={`pd__swatch ${color === variant.color ? 'is-active' : ''}`}
										style={{ background: colorVariant.colorHex }}
										onClick={() => handleColorSelect(color)}
										aria-label={color}
									/>
								);
							})}
						</div>
					</div>

					{/* Size */}
					<div className='pd__option'>
						<div className='pd__option-head'>
							<span className='pd__option-label'>Size</span>
							<span className='pd__option-value'>{variant.size}mm</span>
						</div>
						<div className='pd__size-tiles'>
							{uniqueSizes.map((size) => {
								const available = isSizeAvailable(size, variant.color);
								return (
									<button
										key={size}
										className={`pd__size-tile ${size === variant.size ? 'is-active' : ''} ${!available ? 'is-disabled' : ''}`}
										onClick={() => available && handleSizeSelect(size)}
										disabled={!available}
									>
										{size}mm
									</button>
								);
							})}
						</div>
					</div>

					{/* Mode */}
					{variant.mode?.length > 0 && (
						<div className='pd__option'>
							<div className='pd__option-head'>
								<span className='pd__option-label'>Mode</span>
							</div>
							<div className='pd__modes'>
								{variant.mode.map((m) => (
									<span key={m} className='pd__mode is-active'>
										{m}
									</span>
								))}
							</div>
						</div>
					)}
					{/* Quantity + Actions */}
					<div className='pd__actions'>
						<div className='pd__stepper'>
							<button
								onClick={() => handleQtyChange(-1)}
								disabled={qty <= 1}
								aria-label='Decrease quantity'
							>
								−
							</button>
							<span>{qty}</span>
							<button
								onClick={() => handleQtyChange(1)}
								disabled={qty >= variant.stock}
								aria-label='Increase quantity'
							>
								+
							</button>
						</div>
						<button
							className='pd__add'
							disabled={!inStock}
							onClick={handleAddToCart}
						>
							{inStock ? 'Add to Cart' : 'Out of Stock'}
						</button>
					</div>

					<button
						className='pd__buy'
						disabled={!inStock}
						onClick={handleAddToCart}
					>
						Buy Now
					</button>

					{inStock && (
						<p className='pd__stock-note'>
							Max {variant.stock} unit{variant.stock !== 1 ? 's' : ''} available
							for this variant
						</p>
					)}
					{/* Trust icons */}
					<ul className='pd__trust'>
						<li>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.6'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M1 4h13v11H1zM14 8h4l3 3v4h-7z' />
								<circle cx='6' cy='18' r='1.8' />
								<circle cx='17.5' cy='18' r='1.8' />
							</svg>
							Free 2-day shipping
						</li>
						<li>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.6'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M3 9a9 9 0 1 1 1.5 5' />
								<path d='M3 4v5h5' />
							</svg>
							30-day returns
						</li>
						<li>
							<svg
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.6'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z' />
								<path d='M9 12l2 2 4-4' />
							</svg>
							2-year warranty
						</li>
					</ul>
				</div>
			</div>
			{/* Related products */}
			{relatedProducts.length > 0 && (
				<div className='pd__related'>
					<h2 className='pd__section-title'>You may also like</h2>
					<div className='pd__related-grid'>
						{relatedProducts.map((p) => {
							const firstVariant = p.variants?.[0];
							const img = firstVariant?.images?.[0];
							return (
								<div
									key={p.productId}
									className='pd__related-card'
									onClick={() => navigate(`/product/${p.slug}`)}
								>
									<div className='pd__related-img-wrap'>
										{img ? (
											<img src={img} alt={p.name} />
										) : (
											<div className='pd__related-img-placeholder' />
										)}
									</div>
									<p className='pd__related-name'>{p.name}</p>
									<p className='pd__related-price'>
										{formatPrice(firstVariant?.price ?? 0)}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetail;
