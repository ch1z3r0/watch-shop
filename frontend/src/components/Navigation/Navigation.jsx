import './Navigation.css';
import { useAuth } from '../../auth/AuthProvider';
// import { button, li } from 'framer-motion/client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { saveRedirectPath } from '../../auth/authRedirect';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFavourites } from '../../context/FavouritesContext';
import {
	HeartEmptyIcon,
	HeartFilledIcon,
	MoonIcon,
	SunIcon,
} from '../../icons';

const Navigation = ({ cartCount = 0, theme = 'dark', onToggleTheme }) => {
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
					{favCount > 0 ? <HeartFilledIcon /> : <HeartEmptyIcon />}
					{favCount > 0 && <span className='nav__badge'>{favCount}</span>}
				</button>
				<button
					className='nav__theme-toggle'
					onClick={onToggleTheme}
					aria-label={
						theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
					}
				>
					{theme === 'dark' ? <SunIcon /> : <MoonIcon />}
				</button>
			</div>
		</nav>
	);
};

export default Navigation;
