import { Outlet } from 'react-router-dom';
import './RootLayout.css';
import Navigation from '../components/Navigation/Navigation';
import { useState } from 'react';
import Footer from '../components/Footer/Footer';
import { useCart } from '../context/CartContext';

const RootLayout = () => {
	const [theme, setTheme] = useState(
		() => localStorage.getItem('chirons_theme') || 'dark',
	);
	const toggleTheme = () => {
		setTheme((prev) => {
			const next = prev === 'dark' ? 'light' : 'dark';
			localStorage.setItem('chirons_theme', next);
			return next;
		});
	};
	const { cartCount } = useCart();
	return (
		<div className={`root-layout-container ${theme}`}>
			<Navigation
				cartCount={cartCount}
				theme={theme}
				onToggleTheme={toggleTheme}
			/>
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default RootLayout;
