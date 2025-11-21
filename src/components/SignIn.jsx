import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { handleSignInWithEmailAndPassword } from './auth';
import useGoogleSignInPopup from '../hooks/useGoogleSignInPopup';

import { ASSETS } from '../utils/assets';
// import facebook_icon from '../assets/icons/facebook-icon.svg';
// import google_icon from '../assets/icons/google-icon.svg';
// import github_icon from '../assets/icons/github-icon.svg';
// import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';
import useSignInWithEmailAndPassword from '../hooks/useSignInWithEmailAndPassword';

const SignIn = () => {
	const { facebookIcon, googleIcon, xTwitterIcon, githubIcon } = ASSETS;

	const {
		user: googleUser,
		error: googleError,
		isLoading: googleIsLoading,
		signIn: googleSignIn,
	} = useGoogleSignInPopup();

	const {
		signIn: emailSignIn,
		isLoading: emailIsLoading,
		error: emailError,
	} = useSignInWithEmailAndPassword();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [error, setError] = useState(null); // To display errors
	// const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await emailSignIn(email, password);
			// navigate('/');
		} catch (error) {}
	};

	const handleGoogleSignIn = () => { 
		googleSignIn();
	};

	return (
		<div className='signin-form'>
			<h1>Sign In</h1>
			<span>Welcome! Please enter your information!</span>
			<form onSubmit={handleSubmit}>
				<ul>
					<label>Email</label>
					<li>
						<input
							type='email'
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required
						/>
					</li>
					<label>Password</label>
					<li>
						<input
							type='password'
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							required
						/>
					</li>
				</ul>
				<button type='submit'>Sign In</button>
				<p>Forgot Password?</p>
			</form>
			<div className='signin-with'>
				<hr />
				<p>Or Sign In With</p>
				<hr />
			</div>
			<div className='signin-with-icons'>
				<img src={googleIcon} alt='Google Icon' onClick={handleGoogleSignIn} />
				<img src={facebookIcon} alt='Facebook Icon' />
				<img src={githubIcon} alt='Github Icon' />
				<img src={xTwitterIcon} alt='X Twitter Icon' />
			</div>
			<div className='no-account'>
				<span>Don't Have Account?</span>
				<span>
					<Link to='/signup'> Sign Up</Link>
				</span>
			</div>
		</div>
	);
};

export default SignIn;
