import { signInWithEmailAndPassword } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { auth } from '../components/firebase';
import { useNavigate } from 'react-router-dom';
import { consumeRedirectPath } from '../auth/authRedirect';

const useSignInWithEmailAndPassword = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signIn = useCallback(
		async (email, password) => {
			setError(null);
			setIsLoading(true);
			try {
				const result = await signInWithEmailAndPassword(auth, email, password);
				const user = result.user;
				console.log('User signed in:', user.email);
				if (result.user) {
					navigate(consumeRedirectPath('/'), { replace: true });
					console.log(result.user);
				}
			} catch (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.error('Sign-in error:', errorCode, errorMessage);
			} finally {
				setIsLoading(false);
			}
		},
		[auth]
	);

	return { signIn, isLoading, error };
};

export default useSignInWithEmailAndPassword;
