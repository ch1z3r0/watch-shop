import SignIn from '../components/SignIn';

import './SignInPage.css';
// import signin_banner from '../assets/images/watch1.svg';
import { ASSETS } from '../utils/assets';
import AuthLayout from '../layouts/AuthLayout';
// import signin_banner from '../assets/images/watch2.svg';

const SignInPage = () => {
	const { signInBanner } = ASSETS;
	const signInImage = (
		// You can apply motion to the image directly here if you want to animate it
		<img
			src={signInBanner}
			alt='Sign Up Background'
			className='background-image'
		/>
	);
	return (
		<AuthLayout imageContent={signInImage} formType='signInForm'>
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
