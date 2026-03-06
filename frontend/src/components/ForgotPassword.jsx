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
		<div className='signin-form'>
			<div className='signin-main'>
				<div>
					<h1>Forgot Password</h1>
					<span>Enter the email address associated with your account.</span>
				</div>
				<form onSubmit={handleSubmit}>
					<ul className='signin-fields'>
						<li className='field'>
							<input
								id='email'
								type='email'
								value={email}
								placeholder=' '
								onChange={(e) => {
									setEmail(e.target.value);
								}}
								required
							/>
							<label htmlFor='email'>Email</label>
						</li>
						<li>
							<button
								type='submit'
								disabled={isLoading}
								className='signin-button'
							>
								{isLoading ? 'Sending...' : 'Send Reset Link'}
							</button>
						</li>
						{error && <p style={{ color: 'red' }}>{error}</p>}
						{success && <p style={{ color: 'green' }}>Reset email sent!</p>}
					</ul>
				</form>
			</div>
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
