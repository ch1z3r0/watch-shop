import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/signin',
		element: <SignInPage />,
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
