import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

import './AuthLayout.css';

// Variants for the overall page/layout transition
const pageVariants = {
	initial: { opacity: 0, x: '100%' }, // Starts off-screen to the right
	in: { opacity: 1, x: '0%' }, // Slides into view
	out: { opacity: 0, x: '-100%' }, // Slides off-screen to the left (when navigating away)
};

const pageTransition = {
	type: 'tween',
	ease: 'easeInOut',
	duration: 0.7,
};
const AuthLayout = ({ children, imageContent }) => {
	return (
		<div /* className='auth-layout-container' */>
			<AnimatePresence mode='wait'>
				<motion.div
					className='auth-layout-container'
					initial='initial'
					animate='in'
					exit='out'
					variants={pageVariants}
					transition={pageTransition}
				>
					<div className='form-section'>{children}</div>
					<div className='image-section'>
						{/* <img src={imageContent} alt='Background Image' />
						 */}
						{imageContent}
					</div>
					{/* <Outlet /> */}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

export default AuthLayout;
