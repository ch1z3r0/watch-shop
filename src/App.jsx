import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useLocation,
} from 'react-router-dom';
import Homepage from './pages/Homepage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import { AnimatePresence } from 'framer-motion';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { PublicOnly } from './auth/PublicOnly';
import RequireAuth from './auth/RequireAuth';

const AnimatedOutlet = () => {
	const location = useLocation();
	return (
		<AnimatePresence mode='wait'>
			{/* The Outlet will render either SignInPage or SignUpPage */}
			{/* key={location.pathname} is crucial for AnimatePresence */}
			<Outlet key={location.pathname} />
		</AnimatePresence>
	);
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			//public (For anyone)
			{
				index: true,
				element: <Homepage />,
			},

			//public only
			{
				element: <PublicOnly />,
				children: [
					{
						path: '/signin',
						element: <AnimatedOutlet />,
						children: [
							{
								index: true,
								element: <SignInPage />,
							},
						],
					},
					{
						path: '/signup',
						element: <AnimatedOutlet />,
						children: [
							{
								index: true,
								element: <SignUpPage />,
							},
						],
					},
					{
						path: '/forgotpassword',
						element: <AnimatedOutlet />,
						children: [
							{
								index: true,
								element: <ForgotPasswordPage />,
							},
						],
					},
					{
						path: '/resetpassword',
						element: <AnimatedOutlet />,
						children: [
							{
								index: true,
								element: <ResetPasswordPage />,
							},
						],
					},
				],
			},

			//Private Route (Only for signed in users)
			{
				element: (
					<RequireAuth>
						<AnimatedOutlet />
					</RequireAuth>
				),
				children: [],
			},
		],
	},
]);

const App = () => {
	return (
		<>
			<RouterProvider router={router}></RouterProvider>
		</>
	);
};

export default App;
