import { Link } from 'react-router-dom';
// import watch_logo from '../../assets/icons/watch-logo.svg';
import { ASSETS } from '../../utils/assets';

import './Navigation.css';
import { useAuth } from '../../auth/AuthProvider';
// import { button, li } from 'framer-motion/client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { ul } from 'framer-motion/client';

const Navigation = () => {
	const { watchLogo } = ASSETS;
	const { user, isLoading, isAdmin } = useAuth();

	const [moreOpen, setMoreOpen] = useState(false);
	return (
		<div className='navbar'>
			<div className='brand-wrapper'>
				<span className='brand'>CHIRON's</span>
			</div>
			<div className='nav-items-wrapper'>
				{/* <img className='watch-logo' src={watchLogo} alt='Watch Logo' /> */}
				<ul className='nav-items'>
					<li>Home</li>
					<li>Shop</li>
					<li>Cart</li>
					<li className='hideSm'>About Us</li>
					<li className='hideSm'>
						{user ? (
							<button onClick={() => signOut(auth)}>Sign Out</button>
						) : (
							<Link className='navbar-items' to='signin'>
								Sign In
							</Link>
						)}
					</li>
					{isAdmin && (
						<li className='hideSm'>
							<Link className='navbar-items'>Admin</Link>
						</li>
					)}
					<li className='moreWrap'>
						<button
							className='moreBtn'
							onClick={() => setMoreOpen((v) => !v)}
							aria-expanded={moreOpen}
							aria-haspopup='menu'
						>
							More ▾
						</button>
						{moreOpen && (
							<ul className='dropdown'>
								<li>About Us</li>
								<li>
									{user ? (
										<button onClick={() => signOut(auth)}>Sign Out</button>
									) : (
										<Link className='navbar-items' to='signin'>
											Sign In
										</Link>
									)}
								</li>
								{isAdmin && (
									<li>
										<Link className='navbar-items'>Admin</Link>
									</li>
								)}
							</ul>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Navigation;
