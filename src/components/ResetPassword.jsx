import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from './firebase';

const ResetPassword = () => {
	const navigate = useNavigate();
	const [params] = useSearchParams();

	const oobCode = params.get('oobCode');

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [checkingCode, setCheckingCode] = useState(true);
	const [validCode, setValidCode] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const checkCode = async () => {
			setCheckingCode(true);
			setError(null);

			try {
				await verifyPasswordResetCode(auth, oobCode);
				setValidCode(true);
			} catch (error) {
				setError(error);
				setValidCode(false);
			} finally {
				setCheckingCode(false);
			}
		};
		if (oobCode) {
			checkCode();
		} else {
			setError('Reset code not found!');
			setCheckingCode(false);
		}
	}, [oobCode]);

	const handleReset = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		try {
			await confirmPasswordReset(auth, oobCode, password);
			console.log('clicked ');
			setSuccess(true);
			navigate('/signin');
		} catch (error) {}
	};
	return (
		<div className='reset-password signin-form'>
			<h1>Reset Password</h1>
			<form onSubmit={handleReset}>
				<ul>
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
						<button type='submit'>Submit</button>
					</li>
				</ul>
			</form>
		</div>
	);
};

export default ResetPassword;
