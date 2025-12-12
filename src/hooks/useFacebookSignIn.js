import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, facebookProvider } from '../components/firebase';

const useFacebookSignIn = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signIn = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signInWithPopup(auth, facebookProvider);
			const credential = FacebookAuthProvider.credentialFromResult(result);
			setUser(result.user);
			console.log('Welcome, ', result.user.displayName + '!');
			if (result.user) {
				navigate('/');
			}
		} catch (error) {
			setError(error);
			setUser(null);
			console.error('Facebook sign in error', error);
		} finally {
			setIsLoading(false);
		}
	}, [auth, facebookProvider]);

	return { user, error, isLoading, signIn };
};

export default useFacebookSignIn;
