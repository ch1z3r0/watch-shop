import { Link } from 'react-router-dom';
// import watch_logo from '../../assets/icons/watch-logo.svg';
import { ASSETS } from '../../assets';

import './Navigation.css';

const Navigation = () => {
	const { watchLogo } = ASSETS;
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
					<Link className='navbar-items' to='signin'>
						Sign In
					</Link>
				</li>
			</ul>
		</div>
	);
};

export default Navigation;
