import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const useSignUpWithEmailAndPassword = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signUp = async (email, password) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = result.user;
			console.log('User signed in:', user.email);
			if (result.user) {
				navigate('/');
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return { signUp, error, isLoading };
};

export default useSignUpWithEmailAndPassword;
