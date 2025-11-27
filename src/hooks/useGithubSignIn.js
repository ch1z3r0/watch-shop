import { useCallback, useState } from 'react';
import { auth, githubProvider } from '../components/firebase';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const useGithubSignIn = () => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const signIn = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await signInWithPopup(auth, githubProvider);
			const credential = GithubAuthProvider.credentialFromResult(result);
			const token = credential?.accessToken;
			setUser(result.user);
			console.log('Welcome,', result.user.displayName + '!');
			console.log('Signed In with:', result.user.email + '!');
			if (result.user) {
				navigate('/');
			}
		} catch (error) {
			setError(error);
			setUser(null);
			console.error('Github sign in error', error);
		} finally {
			setIsLoading(false);
		}
	}, [auth, githubProvider]);

	return { user, error, isLoading, signIn };
};

export default useGithubSignIn;
