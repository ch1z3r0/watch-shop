import SignIn from '../components/SignIn';

import './SignInPage.css';
import signin_banner from '../assets/images/watch1.svg';
// import signin_banner from '../assets/images/watch2.svg';

const SignInPage = () => {
	return (
		<div className='signin-container'>
			<SignIn />
			<div className='signin-banner'>
				<img src={signin_banner} alt='Signin Banner' />
			</div>
		</div>
	);
};

export default SignInPage;
