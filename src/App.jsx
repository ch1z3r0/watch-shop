import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/signin',
		element: <SignIn />,
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
