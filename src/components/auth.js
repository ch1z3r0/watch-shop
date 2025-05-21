import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Handle Sign In with Email and Password
export const handleSignInWithEmailAndPassword = async (
	email,
	password,
	setError
) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		// Signed in successfully
		const user = userCredential.user;
		console.log('User signed in:', user.email);
	} catch (error) {
		// Handle errors
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error('Sign-in error:', errorCode, errorMessage);
		setError(`Sign-in failed: ${errorMessage}`); // Display error to user
	}
};
