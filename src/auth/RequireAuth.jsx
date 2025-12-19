import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import FullScreenLoader from '../components/FullScreenLoader';
import { saveRedirectPath } from './authRedirect';

const RequireAuth = ({ children }) => {
	const { user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) return <FullScreenLoader message='Checking your session...' />;

	if (!user) {
		saveRedirectPath(location);
		return <Navigate to='/signin' replace />;
	}

	return children ?? <Outlet />;
};

export default RequireAuth;
