import SignUp from '../components/SignUp';

import signup_banner from '../assets/images/watch2.svg';
import './SignUpPage.css';

const SignUpPage = () => {
	return (
		<div className='signup-container'>
			<div className='signup-banner'>
				<img src={signup_banner} alt='Signup Banner' />
			</div>
			<SignUp />
		</div>
	);
};

export default SignUpPage;
