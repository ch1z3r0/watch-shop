import SignUp from '../components/SignUp';

// import signup_banner from '../assets/images/watch2.svg?url';
import { ASSETS } from '../utils/assets';
import './SignUpPage.css';
import AuthLayout from '../layouts/AuthLayout';

const SignUpPage = () => {
	const { signUpBanner } = ASSETS;
	const signUpImage = (
		// You can apply motion to the image directly here if you want to animate it
		<img
			src={signUpBanner}
			alt='Sign Up Background'
			className='background-image'
		/>
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
