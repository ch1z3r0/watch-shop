import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import FullScreenLoader from '../components/FullScreenLoader';

export const PublicOnly = ({ children }) => {
	const { user, isLoading } = useAuth();

	if (isLoading) return <FullScreenLoader message='Checking your session...' />;
	if (user) return <Navigate to='/' replace />;

	return children ?? <Outlet />;
};
