import { Outlet } from 'react-router-dom';
import './RootLayout.css';
import Navigation from '../components/Navigation/Navigation';
import { useState } from 'react';

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
	return (
		<div className='root-layout-container'>
			<Navigation cartCount={0} theme={theme} onToggleTheme={toggleTheme} />
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
