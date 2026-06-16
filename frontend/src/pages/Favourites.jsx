import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

import './Favourites.css';
import { HeartEmptyIcon, HeartFilledIcon } from '../icons';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const getLowestPrice = (variants) => {
	if (!variants || variants.length === 0) return 0;
	return Math.min(...variants.map((v) => v.price));
};

const getFirstImage = (variants) => {
	for (const v of variants || []) {
		if (v.images?.length > 0) return v.images[0];
	}
	return null;
};

const Favourites = () => {
	const { favourites, removeFavourites } = useFavourites();
	const { addToCart } = useCart();
	const navigate = useNavigate();

	const [brands, setBrands] = useState([]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await axios.get(`${API_BASE}/api/brands`);
				setBrands(res.data);
			} catch (err) {
				console.error('Failed to fetch brands:', err);
			}
		};
		fetchBrands();
	}, []);

	const isEmpty = favourites.length === 0;

	if (isEmpty) {
		return (
			<div className='fav fav--empty'>
				<div className='fav__empty-box'>
					<HeartEmptyIcon width={48} height={48} />
					<h1>No favourites yet</h1>
					<p>Explore the collection and save what you love.</p>
					<Link to='/shop' className='fav__empty-btn'>
						Browse Watches
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='fav'>
			<div className='fav__head'>
				<h1 className='fav__title'>Your Favourites</h1>
				<span className='fav__count'>{favourites.length} saved</span>
			</div>

			<div className='fav__grid'>
				{favourites.map((product) => {
					const image = getFirstImage(product.variants);
					const lowestPrice = getLowestPrice(product.variants);

					return (
						<div key={product._id} className='fav-card'>
							<div
								className='fav-card__img-wrap'
								onClick={() => navigate(`/product/${product.slug}`)}
							>
								{image ? (
									<img src={image} alt={product.name} />
								) : (
									<div className='fav-card__img-placeholder' />
								)}
								<button
									className='fav-card__heart'
									onClick={(e) => {
										e.stopPropagation();
										removeFavourites(product._id);
									}}
									aria-label='Remove from favourites'
								>
									<HeartFilledIcon width={14} height={14} />
								</button>
							</div>

							<div className='fav-card__body'>
								<p className='fav-card__brand'>
									{brands.find((b) => b.brandId === product.brandId)?.name ||
										product.brandId}
								</p>
								<p
									className='fav-card__name'
									onClick={() => navigate(`/product/${product.slug}`)}
								>
									{product.name}
								</p>
								<p className='fav-card__price'>{formatPrice(lowestPrice)}</p>
								<button
									className='fav-card__add'
									onClick={() => navigate(`/product/${product.slug}`)}
								>
									Select Options
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Favourites;
