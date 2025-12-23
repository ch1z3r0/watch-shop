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
	const [localError, setLocalError] = useState('');
	const [checkingCode, setCheckingCode] = useState(true);
	const [validCode, setValidCode] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const checkCode = async () => {
			setCheckingCode(true);
			setError(null);
			setLocalError('');

			try {
				await verifyPasswordResetCode(auth, oobCode);
				setValidCode(true);
			} catch (error) {
				setError(error);
				setValidCode(false);
				setLocalError('Reset link is invalid or expired.');
			} finally {
				setCheckingCode(false);
			}
		};
		if (oobCode) {
			checkCode();
		} else {
			setValidCode(false);
			setError('Reset code not found!');
			setCheckingCode(false);
		}
	}, [oobCode]);

	const handleReset = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		setLocalError('');

		if (!validCode) {
			setLocalError('Reset link is invalid or expired.');
			return;
		} else if (password !== confirmPassword) {
			setLocalError('Password does not match!');
			return;
		} else if (!oobCode) {
			setLocalError('Reset code not found!');
			return;
		}

		try {
			setIsLoading(true);
			await confirmPasswordReset(auth, oobCode, password);
			console.log('clicked ');
			setSuccess(true);
			navigate('/signin');
		} catch (error) {
			setError(err);
			setLocalError(err?.message ?? 'Something went wrong.');
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='signin-form'>
			<div className='signin-main'>
				<div>
					<h1>Reset Password</h1>
					<span>Please enter new password for your account.</span>
				</div>
				<form onSubmit={handleReset}>
					<ul className='signin-fields'>
						<li className='field'>
							<input
								type='password'
								id='password'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								required
								placeholder=' '
							/>
							<label htmlFor='password'>Password</label>
						</li>
						<li className='field'>
							<input
								type='password'
								id='confirm-password'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								placeholder=' '
							/>
							<label htmlFor='confirm-password'>Confirm Password</label>
						</li>
						{localError && (
							<li>
								<span style={{ color: 'red' }}>{localError || error}</span>
							</li>
						)}
						<li>
							<button
								type='submit'
								className='signin-button'
								disabled={isLoading}
							>
								{isLoading ? 'Resetting your password...' : 'Confirm'}
							</button>
						</li>
					</ul>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
