import { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: Boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem('admin_token'),
	);

	const login = (newToken: string) => {
		localStorage.setItem('admin_token', newToken);
		setToken(newToken);
	};
	const logout = () => {
		localStorage.removeItem('admin_token');
		setToken(null);
	};
	return (
		<AuthContext.Provider
			value={{ token, login, logout, isAuthenticated: !!token }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used inside AuthProvider');

	return context;
};
