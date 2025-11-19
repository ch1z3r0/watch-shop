// import facebook_icon from '../assets/icons/facebook-icon.svg';
// import google_icon from '../assets/icons/google-icon.svg';
// import github_icon from '../assets/icons/github-icon.svg';
// import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';
import { useState } from 'react';
import useSignUpWithEmailAndPassword from '../hooks/useSignUpWithEmailAndPassword';
import { ASSETS } from '../utils/assets';
import { Link } from 'react-router-dom';

const SignUp = () => {
	const { facebookIcon, googleIcon, githubIcon, xTwitterIcon } = ASSETS;

	const [email, setEmail] = useState('');
	const {
		signUp: emailSignUp,
		isLoading: emailIsLoading,
		error: emailError,
	} = useSignUpWithEmailAndPassword;
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await emailSignUp(email, password);
		} catch (error) {}
	};
	return (
		<div className='signup-form'>
			<h1>Sign Up</h1>
			<span>Let's Start Your Wonderful Journey With TrackMate</span>
			<form onSubmit={handleSubmit}>
				<ul>
					<label htmlFor='username'>Username</label>
					<li>
						<input type='text' id='username' />
					</li>
					<label htmlFor='email'>Email</label>
					<li>
						<input type='text' id='email' />
					</li>
					<label htmlFor='password'>Password</label>
					<li>
						<input type='text' id='password' />
					</li>
					<label htmlFor='confirm-password'>Confirm Password</label>
					<li>
						<input type='text' id='confirm-password' />
					</li>
					<li>
						<input type='checkbox' name='terms' id='terms' />
						<span>
							&nbsp; By checking in the box, you accept our
							<span> Terms & Conditions </span>
							and
							<span> Privacy Policy</span>
						</span>
					</li>
					<button t ype='submit'>
						Sign Up
					</button>
				</ul>
			</form>
			<div className='signup-with'>
				<hr />
				<p>Or Sign Up With</p>
				<hr />
			</div>
			<div className='signup-with-icons'>
				<img
					src={googleIcon}
					alt='Google Icon' /* onClick={handleGoogleSignIn} */
				/>
				<img src={facebookIcon} alt='Facebook Icon' />
				<img src={githubIcon} alt='Github Icon' />
				<img src={xTwitterIcon} alt='X Twitter Icon' />
			</div>
			<div className='no-account'>
				<span>Already Have Account?</span>
				<span>
					<Link to='/signin'> Sign In</Link>
				</span>
			</div>
		</div>
	);
};

export default SignUp;
