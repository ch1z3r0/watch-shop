import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { handleSignInWithEmailAndPassword } from './auth';
import useGoogleSignInPopup from '../hooks/useGoogleSignInPopup';

import { ASSETS } from '../utils/assets';

import useSignInWithEmailAndPassword from '../hooks/useSignInWithEmailAndPassword';
import useGithubSignIn from '../hooks/useGithubSignIn';

const SignIn = () => {
	const { facebookIcon, googleIcon, xTwitterIcon, githubIcon } = ASSETS;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [localError, setLocalError] = useState('');

	const {
		user: githubUser,
		error: githubError,
		isLoading: githubIsLoading,
		signIn: githubSignIn,
	} = useGithubSignIn();

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

	const handleGithubSignIn = () => {
		githubSignIn();
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
					{(localError || emailError) && (
						<li>
							<span style={{ color: 'red' }}>{localError || emailError}</span>
						</li>
					)}
				</ul>
				<span>
					<Link to='/forgotpassword'>Forgot Password?</Link>
				</span>
				{/* <p>Forgot Password?</p> */}
				<button type='submit' disabled={emailIsLoading}>
					{emailIsLoading ? 'Signing In...' : 'Sign In'}
				</button>
			</form>
			<div className='signin-with'>
				<hr />
				<p>Or Sign In With</p>
				<hr />
			</div>
			<div className='signin-with-icons'>
				<img src={googleIcon} alt='Google Icon' onClick={handleGoogleSignIn} />
				<img src={facebookIcon} alt='Facebook Icon' />
				<img src={githubIcon} alt='Github Icon' onClick={handleGithubSignIn} />
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
