import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';

const AuthContext = createContext({
	user: null,
	isLoading: true,
	isAdmin: false,
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (u) => {
			setUser(u);

			if (u) {
				try {
					const idTokenResult = await u.getIdTokenResult();
					console.log(idTokenResult);

					setIsAdmin(idTokenResult.claims.admin === true);
				} catch (error) {
					console.error('Error checking admin status: ', error);
					setIsAdmin(false);
				}
			} else {
				setIsAdmin(false);
			}
			setIsLoading(false);
		});
		return unsub;
	}, []);

	return (
		<AuthContext.Provider value={{ user, isAdmin, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
