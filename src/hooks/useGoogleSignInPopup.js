import { useCallback, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../components/firebase';
import { useNavigate } from 'react-router-dom';

const useGoogleSignInPopup = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signIn = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			setUser(result.user);
			// console.log(result);
			// console.log('User:', result.user);
			console.log('Welcome,', result.user.displayName + '!');
			console.log('Signed In with:', result.user.email + '!');
			// console.log('Google Access Token:', token);
			if (result.user) {
				navigate('/');
			}
		} catch (error) {
			setError(error);
			setUser(null);
			console.error('Google Sign In Error: ', error);
		} finally {
			setIsLoading(false);
		}
	}, [auth, googleProvider]);

	return {
		user,
		error,
		isLoading,
		signIn,
	};
};

export default useGoogleSignInPopup;
