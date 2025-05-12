import { useState } from 'react';
import { auth } from './firebase';
import {
	getRedirectResult,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithRedirect,
} from 'firebase/auth';

// Google Sign-in (Redirect) Function
export const signInWithGoogleRedirect = () => {
	const provider = new GoogleAuthProvider();
	// Use the imported 'auth' instance
	signInWithRedirect(auth, provider); // Returns void or a promise that resolves when redirect starts
};

// Handle Google Redirect Result Function (call this on page load)
export const handleGoogleRedirectResultOnLoad = () => {
	return getRedirectResult(auth);
};

// Handle Sign In with Email and Password

const authState = () => {
	const [error, setError] = useState(null); // To display errors
	return;
};

export default auth;

export const handleSignInWithEmailAndPassword = async (e) => {
	e.preventDefault();
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		// Signed in successfully
		const user = userCredential.user;
		console.log('User signed in:', user);
		navigate('/');
	} catch (error) {
		// Handle errors
		const errorCode = error.code;
		const errorMessage = error.message;
		console.error('Sign-in error:', errorCode, errorMessage);
		setError(`Sign-in failed: ${errorMessage}`); // Display error to user
	}
};
