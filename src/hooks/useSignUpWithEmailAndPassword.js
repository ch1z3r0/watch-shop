import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const useSignUpWithEmailAndPassword = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signUp = async (username, email, password) => {
		setIsLoading(true);
		setError(null);

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			console.log(userCredential.user);
			navigate('/');
			return userCredential.user;
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return;
};

export default useSignUpWithEmailAndPassword;
