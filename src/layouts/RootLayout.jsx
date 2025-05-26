import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
	return (
		<div className='root-layout-container'>
			{/* <AnimatePresence>
				<motion.div>
					<Outlet />
				</motion.div>
			</AnimatePresence> */}
			<main>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
