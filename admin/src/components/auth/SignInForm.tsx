import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setIsLoading(true);
		try {
			const res = await api.post('/api/auth/login', { email, password });
			login(res.data.token);
			navigate('/');
		} catch {
			setError('Invalid email or password');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
			<div className='mb-5 sm:mb-8'>
				<h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
					Admin Sign In
				</h1>
				<p className='text-sm text-gray-500 dark:text-gray-400'>
					Enter your credentials to access the dashboard.
				</p>
			</div>
			<form onSubmit={handleSubmit}>
				<div className='space-y-6'>
					<div>
						<Label>Email</Label>
						<Input
							type='email'
							placeholder='Enter your email address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<Label>Password</Label>
						<div className='relative'>
							<Input
								type={showPassword ? 'text' : 'password'}
								placeholder='Enter your password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<span
								onClick={() => setShowPassword(!showPassword)}
								className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2'
							>
								{showPassword ? (
									<EyeIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
								) : (
									<EyeCloseIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
								)}
							</span>
						</div>
					</div>
					{error && <p className='text-sm text-error-500'>{error}</p>}
					<Button className='w-full' size='sm' disabled={isLoading}>
						{isLoading ? 'Signing in...' : 'Sign In'}
					</Button>
				</div>
			</form>
		</div>
	);
}
