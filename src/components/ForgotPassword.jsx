import { useState } from 'react';
import { Link } from 'react-router-dom';
import useForgotPassword from '../hooks/useForgotPassword';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const { sendReset, error, isLoading, success } = useForgotPassword();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await sendReset(email);
		} catch (error) {}
	};

	return (
		<div className='forgot-password signin-form'>
			<h1>Forgot Password</h1>
			<span>Enter the email address associated with your account.</span>
			<form onSubmit={handleSubmit}>
				<ul>
					<li>
						<input
							type='email'
							value={email}
							placeholder='Email'
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							required
						/>
					</li>
					<li>
						<button type='submit' disabled={isLoading}>
							{isLoading ? 'Sending...' : 'Send Reset Link'}
						</button>
					</li>
					{error && <p style={{ color: 'red' }}>{error}</p>}
					{success && <p style={{ color: 'green' }}>Reset email sent!</p>}
				</ul>
			</form>
			<div className='no-account'>
				<span>Remembered Password?</span>
				<span>
					<Link to='/signin'> Sign In</Link>
				</span>
			</div>
		</div>
	);
};

export default ForgotPassword;
