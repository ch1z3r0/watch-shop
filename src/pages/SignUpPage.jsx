import SignUp from '../components/SignUp';

import signup_banner from '../assets/images/watch2.svg?url';
import './SignUpPage.css';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';

const SignUpPage = () => {
	const signUpImage = (
		// You can apply motion to the image directly here if you want to animate it
		<motion.img
			src={signup_banner}
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
		<AuthLayout imageContent={signUpImage} /* className='signup-container' */>
			{/* <div className='signup-banner'>
				<img src={signup_banner} alt='Signup Banner' />
			</div> */}
			<SignUp />
		</AuthLayout>
	);
};

export default SignUpPage;
