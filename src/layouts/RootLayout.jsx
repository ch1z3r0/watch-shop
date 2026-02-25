import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import './RootLayout.css';
import Navigation from '../components/Navigation/Navigation';

const RootLayout = () => {
	return (
		<div className='root-layout-container'>
			<main>
				{/* <Navigation /> */}

				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
