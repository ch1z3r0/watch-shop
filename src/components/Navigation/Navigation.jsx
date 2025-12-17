import { Link } from 'react-router-dom';
// import watch_logo from '../../assets/icons/watch-logo.svg';
import { ASSETS } from '../../utils/assets';

import './Navigation.css';
import { useAuth } from '../AuthProvider';
import { button, li } from 'framer-motion/client';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navigation = () => {
	const { watchLogo } = ASSETS;
	const { user, isLoading, isAdmin } = useAuth();
	return (
		<div className='navbar'>
			<div>
				<img className='watch-logo' src={watchLogo} alt='Watch Logo' />
				<span className='brand'>WATCH</span>
			</div>
			<ul>
				<li>Home</li>
				<li>Shop</li>
				<li>Cart</li>
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
		</div>
	);
};

export default Navigation;
