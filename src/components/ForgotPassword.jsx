import { useState } from 'react';
import useForgotPassword from '../hooks/useForgotPassword';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [sendReset, error, isLoading, success] = useForgotPassword;

	return (
		<div className='forgot-password'>
			<h1>Forgot Password</h1>
			<span>Enter the email address associated with your account.</span>
			<form>
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
			</form>
		</div>
	);
};

export default ForgotPassword;
