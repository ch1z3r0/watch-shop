import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSignUpWithEmailAndPassword = () => {
	const [error, isError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	return;
};

export default useSignUpWithEmailAndPassword;
