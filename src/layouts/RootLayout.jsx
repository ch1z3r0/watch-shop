import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import './RootLayout.css';

const RootLayout = () => {
	return (
		<div className='root-layout-container'>
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
