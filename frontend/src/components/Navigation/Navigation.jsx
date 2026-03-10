import { Link, useLocation } from 'react-router-dom';
// import watch_logo from '../../assets/icons/watch-logo.svg';
import { ASSETS } from '../../utils/assets';

import './Navigation.css';
import { useAuth } from '../../auth/AuthProvider';
// import { button, li } from 'framer-motion/client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';
import { saveRedirectPath } from '../../auth/authRedirect';

const Navigation = () => {
	const { watchLogo } = ASSETS;
	const { user, isLoading, isAdmin } = useAuth();
	const location = useLocation();

	const [moreOpen, setMoreOpen] = useState(false);
	return (
		<div className='navbar'>
			<div className='brand-wrapper'>
				<span className='brand'>
					<Link to='/'>CHIRON's</Link>
					{/* <a href='/'>CHIRON's</a> */}
				</span>
			</div>
			<div className='nav-items-wrapper'>
				{/* <img className='watch-logo' src={watchLogo} alt='Watch Logo' /> */}
				<ul className='nav-items'>
					<li>
						<Link to='/'>Home</Link>
					</li>
					<li>
						<Link to='/shop'>Shop</Link>
					</li>
					<li>
						<Link to='/shop'>Cart</Link>
					</li>
					<li className='hideSm'>
						<Link to='/shop'>About Us</Link>
					</li>
					<li className='hideSm'>
						{user ? (
							<button onClick={() => signOut(auth)}>Sign Out</button>
						) : (
							<Link
								className='navbar-items'
								to='/signin'
								onClick={() => {
									saveRedirectPath(location);
									console.log(
										'SAVED:',
										sessionStorage.getItem('redirectAfterLogin'),
									);
								}}
							>
								Sign In
							</Link>
						)}
					</li>
					{isAdmin && (
						<li className='hideSm'>
							{/* <Link className='navbar-items'>Admin</Link> */}
							<a href='http://localhost:5174' className='navbar-items'>
								Admin
							</a>
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
								<li>
									<Link to='/shop'>About Us</Link>
								</li>
								<li>
									{user ? (
										<button onClick={() => signOut(auth)}>Sign Out</button>
									) : (
										<Link
											className='navbar-items'
											to='/signin'
											onClick={() => {
												saveRedirectPath(location);
												console.log(
													'SAVED:',
													sessionStorage.getItem('redirectAfterLogin'),
												);
											}}
										>
											Sign In
										</Link>
									)}
								</li>
								{isAdmin && (
									<li>
										{/* <Link className='navbar-items'>Admin</Link> */}
										<a href='http://localhost:5174' className='navbar-items'>
											Admin
										</a>
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
