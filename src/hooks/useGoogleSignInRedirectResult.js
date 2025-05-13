import { useEffect, useState } from 'react';
import { handleGoogleRedirectResultOnLoad } from '../components/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase';

const useGoogleSignInRedirectResult = () => {
	const [googleSignInResult, setGoogleSignInResult] = useState(null);
	// const navigate = useNavigate();
	useEffect(() => {
		const processResult = async () => {
			const result = await handleGoogleRedirectResultOnLoad();
			setGoogleSignInResult(result);
			// if (result) {
			// 	console.log(result);

			// navigate('/');
			// }
			console.log(result);
			if (result?.user) {
				console.log('Google Sign-in successful (from hook):', result.user);
				// navigate('/');
			} else {
				console.log('No Google redirect result (from hook).');
			}
		};

		processResult();
	}, []);

	return googleSignInResult;
};

export default useGoogleSignInRedirectResult;
