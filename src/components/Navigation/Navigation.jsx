import { Link } from 'react-router-dom';
import watch_logo from '../../assets/icons/watch-logo.svg';

import './Navigation.css';

const Navigation = () => {
	return (
		<div className='navbar'>
			<div>
				<img className='watch-logo' src={watch_logo} alt='Watch Logo' />
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
