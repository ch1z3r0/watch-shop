import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { handleSignInWithEmailAndPassword } from './auth';
import useGoogleSignInPopup from '../hooks/useGoogleSignInPopup';

import { ASSETS } from '../utils/assets';

import useSignInWithEmailAndPassword from '../hooks/useSignInWithEmailAndPassword';
import useGithubSignIn from '../hooks/useGithubSignIn';
import useFacebookSignIn from '../hooks/useFacebookSignIn';

const SignIn = () => {
	const { facebookIcon, googleIcon, xTwitterIcon, githubIcon, arrowLeft } =
		ASSETS;

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
		user: facebookUser,
		error: facebookError,
		isLoading: facebookIsLoading,
		signIn: facebookSignIn,
	} = useFacebookSignIn();

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

	const handleFacebookSignIn = () => {
		facebookSignIn();
	};

	return (
		<div className='signin-form'>
			<div className='back-browse'>
				<Link to='/'>
					<img src={arrowLeft} alt='Arrow Left' />
					Back to browsing
				</Link>
			</div>
			<div className='signin-main'>
				<div>
					<h1>Sign In</h1>
					<span>Welcome! Please enter your information!</span>
				</div>
				<form onSubmit={handleSubmit}>
					<ul>
						<li className='field'>
							<input
								id='email'
								type='email'
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								required
								placeholder=' '
								// autoComplete='email'
							/>
							<label htmlFor='email'>Email</label>
						</li>
						<li className='field'>
							<input
								id='password'
								type='password'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								required
								placeholder=' '
								autoComplete='off'
							/>
							<label htmlFor='password'>Password</label>
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
					<button
						type='submit'
						disabled={emailIsLoading}
						className='signin-button'
					>
						{emailIsLoading ? 'Signing In...' : 'Sign In'}
					</button>
				</form>
				<div className='signin-with'>
					<hr />
					<p>Or Sign In With</p>
					<hr />
				</div>
				<div className='signin-with-icons'>
					<img
						src={googleIcon}
						alt='Google Icon'
						onClick={handleGoogleSignIn}
					/>
					<img
						src={facebookIcon}
						alt='Facebook Icon'
						onClick={handleFacebookSignIn}
					/>
					<img
						src={githubIcon}
						alt='Github Icon'
						onClick={handleGithubSignIn}
					/>
					{/* <img src={xTwitterIcon} alt='X Twitter Icon' /> */}
				</div>
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
