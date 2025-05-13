import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';
import {
	handleSignInWithEmailAndPassword,
	signInWithGoogleRedirect,
} from './auth';
import useGoogleSignInRedirectResult from '../hooks/useGoogleSignInRedirectResult';

import facebook_icon from '../assets/icons/facebook-icon.svg';
import google_icon from '../assets/icons/google-icon.svg';
import github_icon from '../assets/icons/github-icon.svg';
import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';
import { getRedirectResult } from 'firebase/auth';

const SignIn = () => {
	// Get the auth instance
	const auth = getAuth(app);
	useGoogleSignInRedirectResult();
	// useEffect(() => {
	// 	const checkRedirect = async () => {
	// 		const result = await getRedirectResult(auth);
	// 		console.log('Directly in component result:', result);
	// 		if (result?.user) {
	// 			console.log('User found directly in component');
	// 			// window.location.href = '/'; // Force a full page redirect
	// 		} else {
	// 			console.log('No result directly in component');
	// 		}
	// 	};

	// 	checkRedirect();
	// }, []);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null); // To display errors
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null); //clear previous errors
		try {
			await handleSignInWithEmailAndPassword(email, password, setError);
			navigate('/');
		} catch (error) {}
	};

	const handleGoogleSignIn = () => {
		signInWithGoogleRedirect();
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
				<p>Or Sign In with</p>
				<hr />
			</div>
			<div className='signin-with-icons'>
				<img src={google_icon} alt='Google Icon' onClick={handleGoogleSignIn} />
				<img src={facebook_icon} alt='Facebook Icon' />
				<img src={github_icon} alt='Github Icon' />
				<img src={x_twitter_icon} alt='LinkedIn Icon' />
			</div>
		</div>
	);
};

export default SignIn;
