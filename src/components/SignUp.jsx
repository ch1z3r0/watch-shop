// import facebook_icon from '../assets/icons/facebook-icon.svg';
// import google_icon from '../assets/icons/google-icon.svg';
// import github_icon from '../assets/icons/github-icon.svg';
// import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';
import { useState } from 'react';
import useSignUpWithEmailAndPassword from '../hooks/useSignUpWithEmailAndPassword';
import { ASSETS } from '../utils/assets';
import { Link } from 'react-router-dom';
import useGoogleSignInPopup from '../hooks/useGoogleSignInPopup';
import useGithubSignIn from '../hooks/useGithubSignIn';
import useFacebookSignIn from '../hooks/useFacebookSignIn';

const SignUp = () => {
	const { facebookIcon, googleIcon, githubIcon, xTwitterIcon } = ASSETS;

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [localError, setLocalError] = useState('');
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const {
		signUp: emailSignUp,
		isLoading: emailIsLoading,
		error: emailError,
	} = useSignUpWithEmailAndPassword();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLocalError('');

		if (!acceptedTerms) {
			setLocalError('Must accept terms and conditions!');
			return;
		} else if (password !== confirmPassword) {
			setLocalError('Password does not match!');
			return;
		} else if (!username.trim()) {
			setLocalError('Username Required!');
			return;
		}

		try {
			await emailSignUp(username, email, password);
		} catch (error) {
			console.error(error);
		}
	};

	const {
		user: googleUser,
		error: googleError,
		isLoading: googleIsLoading,
		signIn: googleSignIn,
	} = useGoogleSignInPopup();

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
		<div className='signup-form'>
			<h1>Sign Up</h1>
			<span>Let's Start Your Wonderful Journey With TrackMate</span>
			<form onSubmit={handleSubmit}>
				<ul>
					<label htmlFor='username'>Username</label>
					<li>
						<input
							type='text'
							id='username'
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							required
						/>
					</li>
					<label htmlFor='email'>Email</label>
					<li>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required
						/>
					</li>
					<label htmlFor='password'>Password</label>
					<li>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							required
						/>
					</li>
					<label htmlFor='confirm-password'>Confirm Password</label>
					<li>
						<input
							type='password'
							id='confirm-password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</li>
					<li>
						<input
							type='checkbox'
							name='terms'
							id='terms'
							checked={acceptedTerms}
							onChange={(e) => {
								setAcceptedTerms(e.target.checked);
							}}
						/>
						<span>
							&nbsp; By checking in the box, you accept our
							<span> Terms & Conditions </span>
							and
							<span> Privacy Policy</span>
						</span>
					</li>
					{(localError || emailError) && (
						<li>
							<span style={{ color: 'red' }}>{localError || emailError}</span>
						</li>
					)}

					<button type='submit' disabled={emailIsLoading}>
						{emailIsLoading ? 'Signing Up...' : 'Sign Up'}
					</button>
				</ul>
			</form>
			<div className='signup-with'>
				<hr />
				<p>Or Sign Up With</p>
				<hr />
			</div>
			<div className='signup-with-icons'>
				<img src={googleIcon} alt='Google Icon' onClick={handleGoogleSignIn} />
				<img
					src={facebookIcon}
					alt='Facebook Icon'
					onClick={handleFacebookSignIn}
				/>
				<img src={githubIcon} alt='Github Icon' onClick={handleGithubSignIn} />
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
