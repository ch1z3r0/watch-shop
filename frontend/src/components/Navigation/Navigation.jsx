// import watch_logo from '../../assets/icons/watch-logo.svg';
import { ASSETS } from '../../utils/assets';

import './Navigation.css';
import { useAuth } from '../../auth/AuthProvider';
// import { button, li } from 'framer-motion/client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { saveRedirectPath } from '../../auth/authRedirect';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFavourites } from '../../context/FavouritesContext';

const HeartFilled = () => (
	<svg viewBox='0 0 24 24' width='17' height='17' fill='#c9a84c'>
		<path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
	</svg>
);

const HeartEmpty = () => (
	<svg
		viewBox='0 0 24 24'
		width='17'
		height='17'
		fill='none'
		stroke='currentColor'
		strokeWidth='1.8'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
	</svg>
);

const Navigation = ({ cartCount = 0 }) => {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, isAdmin } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);
	const { favCount } = useFavourites();

	const isActive = (path) => (location.pathname === path ? 'is-active' : '');

	const handleSignOut = async () => {
		await signOut(auth);
		navigate('/');
		setMenuOpen(false);
	};

	const closeMenu = () => setMenuOpen(false);

	return (
		<nav className='nav'>
			<Link to='/' className='nav__brand' onClick={closeMenu}>
				CHIRON's
			</Link>

			{/* Desktop links */}
			<ul className='nav__items'>
				<li>
					<Link to='/' className={isActive('/')}>
						Home
					</Link>
				</li>
				<li>
					<Link to='/shop' className={isActive('/shop')}>
						Shop
					</Link>
				</li>
				<li>
					<Link to='/track-order' className={isActive('/track-order')}>
						Track Order
					</Link>
				</li>
				<li>
					<Link to='/promotions' className={isActive('/promotions')}>
						Promotions
					</Link>
				</li>
				<li>
					<Link to='/cart' className={isActive('/cart')}>
						{cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}
					</Link>
				</li>
				{isAdmin && (
					<li>
						<a href='http://localhost:5174' className={`${isActive('/admin')}`}>
							Admin
						</a>
					</li>
				)}
				<li>
					{user ? (
						<button onClick={handleSignOut}>Sign Out</button>
					) : (
						<Link
							to='/signin'
							className={isActive('/signin')}
							onClick={() => saveRedirectPath(location)}
						>
							Sign In
						</Link>
					)}
				</li>
			</ul>

			{/* Hamburger button — mobile only */}
			<button
				className={`nav__hamburger ${menuOpen ? 'is-open' : ''}`}
				onClick={() => setMenuOpen((prev) => !prev)}
				aria-label='Toggle menu'
			>
				<span />
				<span />
				<span />
			</button>

			{/* Mobile dropdown */}
			{menuOpen && (
				<div className='nav__mobile-menu'>
					<ul>
						<li>
							<Link to='/' className={isActive('/')} onClick={closeMenu}>
								Home
							</Link>
						</li>
						<li>
							<Link
								to='/shop'
								className={isActive('/shop')}
								onClick={closeMenu}
							>
								Shop
							</Link>
						</li>
						<li>
							<Link
								to='/track-order'
								className={isActive('/track-order')}
								onClick={closeMenu}
							>
								Track Order
							</Link>
						</li>
						<li>
							<Link
								to='/promotions'
								className={isActive('/promotions')}
								onClick={closeMenu}
							>
								Promotions
							</Link>
						</li>
						<li>
							<Link
								to='/cart'
								className={isActive('/cart')}
								onClick={closeMenu}
							>
								{cartCount > 0 ? `Cart (${cartCount})` : 'Cart'}
							</Link>
						</li>
						{isAdmin && (
							<li>
								<a href='http://localhost:5174' onClick={closeMenu}>
									Admin
								</a>
							</li>
						)}
						<li className='nav__mobile-divider' />
						<li>
							{user ? (
								<button onClick={handleSignOut}>Sign Out</button>
							) : (
								<Link
									to='/signin'
									className={isActive('/signin')}
									onClick={() => {
										saveRedirectPath(location);
										closeMenu();
									}}
								>
									Sign In
								</Link>
							)}
						</li>
					</ul>
				</div>
			)}
			<div className='nav__utils'>
				<button className='nav__icon-btn' aria-label='Favourites'>
					{favCount > 0 ? <HeartFilled /> : <HeartEmpty />}
					{favCount > 0 && <span className='nav__badge'>{favCount}</span>}
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
