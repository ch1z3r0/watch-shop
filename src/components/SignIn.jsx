import { useState } from 'react';

const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(email, password);
	};
	return (
		<div className='signin-form'>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				<ul>
					<label>Email</label>
					<li>
						<input
							type='email'
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
					</li>
					<label>Password</label>
					<li>
						<input
							type='password'
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
					</li>
				</ul>
				<button type='submit'>Sign In</button>
			</form>
		</div>
	);
};

export default SignIn;
