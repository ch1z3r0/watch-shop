import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
	return (
		<footer className='footer'>
			<div className='footer__brand'>CHIRON's</div>
			<ul className='footer__links'>
				<li>
					<Link to='/shop'>Shop</Link>
				</li>
				<li>
					<Link to='/customize'>Customize</Link>
				</li>
				<li>
					<Link to='/support'>Support</Link>
				</li>
				<li>
					<Link to='/about'>About</Link>
				</li>
				<li>
					<Link to='/privacy'>Privacy</Link>
				</li>
			</ul>
			<span>© 2025 CHIRON's Watch Co.</span>
		</footer>
	);
};

export default Footer;
