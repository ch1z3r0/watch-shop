import SignIn from '../components/SignIn';

import './AuthForm.css';
// import signin_banner from '../assets/images/watch1.svg';
import { ASSETS } from '../utils/assets';
import AuthLayout from '../layouts/AuthLayout';
// import signin_banner from '../assets/images/watch2.svg';

const SignInPage = () => {
	const { signInBanner } = ASSETS;
	const signInImage = (
		<div className='auth-banner auth-banner--signin'>
			<img
				src={signInBanner}
				alt="CHIRON's smartwatch"
				className='background-image'
			/>
			<div className='auth-banner__copy'>
				<h2>Smart enough for every adventure.</h2>
				<p>
					Track your goals, stay connected, and explore the CHIRON's smartwatch
					collection.
				</p>
			</div>
		</div>
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
