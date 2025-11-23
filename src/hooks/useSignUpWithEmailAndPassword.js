import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../components/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const useSignUpWithEmailAndPassword = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signUp = useCallback(
		async (username, email, password) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await updateProfile(result.user, {
					displayName: username,
				});
				const user = result.user;
				console.log('User signed in:', user.email);
				console.log('Username signed in:', username);
				if (result.user) {
					navigate('/');
					console.log(result.user);
				}
			} catch (error) {
				setError(error.message);
			} finally {
				setIsLoading(false);
			}
		},
		[auth]
	);

	return { signUp, error, isLoading };
};

export default useSignUpWithEmailAndPassword;
