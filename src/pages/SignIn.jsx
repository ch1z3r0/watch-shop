import user from '../user/user.js';

import './SignIn.css';

const SignIn = () => {
	return (
		<div className='signin-container'>
			<div className='signin-form'>
				<h1>Sign In</h1>
				<form>
					<ul>
						<label>Email</label>
						<li>
							<input type='text' />
						</li>
						<label>Password</label>
						<li>
							<input type='password' />
						</li>
					</ul>
					<button type='submit'>Sign In</button>
				</form>
			</div>
			<div className='signin-banner'></div>
		</div>
	);
};

export default SignIn;
