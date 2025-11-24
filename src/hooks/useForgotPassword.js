import { sendPasswordResetEmail } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { auth } from '../components/firebase';

const useForgotPassword = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const sendReset = useCallback(async (email) => {
		try {
			await sendPasswordResetEmail(auth, email);
			setSuccess(true);
			return true;
		} catch (error) {
			setError(error.message);
			return false;
		} finally {
			setIsLoading(false);
		}
	});

	return { sendReset, error, isLoading, success };
};

export default useForgotPassword;
