import SignUp from '../components/SignUp';

// import signup_banner from '../assets/images/watch2.svg?url';
import { ASSETS } from '../utils/assets';
import AuthLayout from '../layouts/AuthLayout';
import './AuthForm.css';

const SignUpPage = () => {
	const { signUpBanner } = ASSETS;
	const signUpImage = (
		<div className='auth-banner auth-banner--signup'>
			<img
				src={signUpBanner}
				alt="CHIRON's smartwatch"
				className='background-image'
			/>
			<div className='auth-banner__copy'>
				<h2>Join the journey.</h2>
				<p>
					Create your account to save favourites, track orders, and discover
					your next CHIRON's smartwatch.
				</p>
			</div>
		</div>
	);

	return (
		<AuthLayout
			imageContent={signUpImage}
			formType='signUpForm' /* className='signup-container' */
		>
			{/* <div className='signup-banner'>
				<img src={signup_banner} alt='Signup Banner' />
			</div> */}
			<SignUp />
		</AuthLayout>
	);
};

export default SignUpPage;
