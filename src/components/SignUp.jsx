import facebook_icon from '../assets/icons/facebook-icon.svg';
import google_icon from '../assets/icons/google-icon.svg';
import github_icon from '../assets/icons/github-icon.svg';
import x_twitter_icon from '../assets/icons/x-twitter-icon.svg';

const SignUp = () => {
	return (
		<div className='signup-form'>
			<h1>Sign Up</h1>
			<span>Let's Start Your Wonderful Journey With TrackMate</span>
			<form action=''>
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
				</ul>
			</form>
			<div className='signup-with'>
				<hr />
				<p>Or Sign Up With</p>
				<hr />
			</div>
			<div className='signup-with-icons'>
				<img
					src={google_icon}
					alt='Google Icon' /* onClick={handleGoogleSignIn} */
				/>
				<img src={facebook_icon} alt='Facebook Icon' />
				<img src={github_icon} alt='Github Icon' />
				<img src={x_twitter_icon} alt='LinkedIn Icon' />
			</div>
			<div className='no-account'>
				<span>Already Have Account?</span>
				<span> Sign In</span>
			</div>
		</div>
	);
};

export default SignUp;
