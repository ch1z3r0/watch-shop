import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './AuthLayout.css';

const AuthLayout = ({ children, imageContent, formType }) => {
	// const prevFormTypeRef = useRef(formType);

	// useEffect(() => {
	// 	prevFormTypeRef.current = formType;
	// }, [formType]);

	// const prevFormType = prevFormTypeRef.current;
	// const initialPanelState =
	// 	prevFormType === 'signInForm' ? 'signInActive' : 'signUpActive';

	const isSignInForm = formType === 'signInForm';
	// Determine the current state for the panel animations
	const currentPanelState = isSignInForm ? 'signInActive' : 'signUpActive';

	// console.log(formType);
	console.log('currentPanelState:', currentPanelState);

	// --- Variants for the Form Panel (the entire panel that slides horizontally) ---
	const formPanelSlideVariants = {
		signInActive: {
			// transform: 'translateX(0%)', // Form panel is at its default left position
			x: '0%',
			transition: {
				type: 'spring',
				stiffness: 150,
				damping: 25,
				duration: 0.8,
			},
		},
		signUpActive: {
			x: '100%', // Form panel slides right by 100% of its own width
			transition: {
				type: 'spring',
				stiffness: 150,
				damping: 25,
				duration: 0.8,
			},
		},
	};

	// --- Form Content Variants (for the actual sign-in/sign-up components within the form panel) ---
	const formContentMorphVariants = {
		initial: { opacity: 0, scale: 0.9 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: {
				delay: 0.3, // Delay slightly after panel starts sliding
				duration: 0.5,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
			transition: {
				duration: 0.4,
				ease: 'easeIn',
			},
		},
	};

	// --- Variants for the Image Panel (slides horizontally, opposite of form) ---
	const imagePanelSlideVariants = {
		signInActive: {
			// transform: 'translateX(0%)', // Image panel is at its default right position
			x: '0%',
			transition: {
				type: 'spring',
				stiffness: 150,
				damping: 25,
				duration: 0.8,
			},
		},
		signUpActive: {
			x: '-100%', // Image panel slides left by 100% of its own width
			transition: {
				type: 'spring',
				stiffness: 150,
				damping: 25,
				duration: 0.8,
			},
		},
	};

	// --- Image Content Variants (for the actual image/banner within the image panel) ---
	const imageContentFadeVariants = {
		initial: { opacity: 0, scale: 0.95 },
		animate: {
			opacity: 1,
			scale: 1,
			transition: {
				delay: 0.4, // Delay slightly after panel starts sliding
				duration: 0.6,
				ease: 'easeOut',
			},
		},
		exit: {
			opacity: 0,
			scale: 0.95,
			transition: {
				duration: 0.5,
				ease: 'easeIn',
			},
		},
	};
	// console.log(
	// 	'formPanelSlideVariants:',
	// 	formPanelSlideVariants[currentPanelState]
	// );
	// console.log(
	// 	'imagePanelSlideVariants:',
	// 	imagePanelSlideVariants[currentPanelState]
	// );
	return (
		<>
			<motion.div className='auth-layout-container'>
				<motion.div
					// key='form-panel-key'
					className='form-panel'
					// initial={false}
					animate={currentPanelState}
					// exit={currentPanelState}
					variants={formPanelSlideVariants}
				>
					<AnimatePresence mode='wait' initial={false}>
						<motion.div
							key={formType}
							className='form-section'
							initial='initial'
							animate='animate'
							exit='exit'
							variants={formContentMorphVariants}
						>
							{children}
						</motion.div>
					</AnimatePresence>
				</motion.div>

				<motion.div
					// key='image-panel-key'
					className='image-panel'
					// initial={false}
					animate={currentPanelState}
					// exit={currentPanelState}
					variants={imagePanelSlideVariants}
				>
					<AnimatePresence mode='wait' initial={false}>
						<motion.div
							key={
								isSignInForm ? 'signin-image-content' : 'signup-image-content'
							}
							className='image-section'
							initial='initial'
							animate='animate'
							exit='exit'
							variants={imageContentFadeVariants}
						>
							{imageContent}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</motion.div>
		</>
	);
};

export default AuthLayout;
