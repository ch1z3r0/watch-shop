import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase';

import facebook_icon from '../assets/icons/facebook-icon.svg';
import google_icon from '../assets/icons/google-icon.svg';
import github_icon from '../assets/icons/github-icon.svg';
import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';
import {
	handleGoogleRedirectResultOnLoad,
	handleSignInWithEmailAndPassword,
	signInWithGoogleRedirect,
} from './auth';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// Get the auth instance
	// const auth = getAuth(app);

	const navigate = useNavigate();

	// handleGoogleRedirectResultOnLoad()
	// 	.then((result) => {
	// 		if (result) {
	// 			// User successfully signed in via redirect
	// 			const user = result.user;
	// 			console.log('Redirect sign-in successful:', user);
	// 			// navigate('/');
	// 			// Update your UI for the signed-in user
	// 		} else {
	// 			// No redirect result, continue with normal page logic
	// 			console.log('No pending redirect result.');
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error handling redirect result:', error);
	// 	});

	return (
		<div className='signin-form'>
			<h1>Sign In</h1>
			<span>Welcome! Please enter your information!</span>
			<form onSubmit={handleSignInWithEmailAndPassword}>
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
				<img
					src={google_icon}
					alt='Google Icon'
					onClick={signInWithGoogleRedirect}
				/>
				<img src={facebook_icon} alt='Facebook Icon' />
				<img src={github_icon} alt='Github Icon' />
				<img src={x_twitter_icon} alt='LinkedIn Icon' />
			</div>
		</div>
	);
};

export default SignIn;
