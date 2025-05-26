import SignIn from '../components/SignIn';

import './SignInPage.css';
import signin_banner from '../assets/images/watch1.svg';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
// import signin_banner from '../assets/images/watch2.svg';

const SignInPage = () => {
	const signInImage = (
		// You can apply motion to the image directly here if you want to animate it
		<motion.img
			src={signin_banner}
			alt='Sign Up Background'
			className='background-image'
			// Example animation for the image as it appears with the page
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.8 }}
			transition={{ duration: 0.7, ease: 'easeInOut' }}
		/>
	);
	return (
		<AuthLayout imageContent={signInImage}>
			{/* <div className='signin-container'>
				<SignIn />
				<div className='signin-banner'>
					<img src={signin_banner} alt='Signin Banner' />
				</div>
			</div> */}
			<SignIn />
		</AuthLayout>
	);
};

export default SignInPage;
