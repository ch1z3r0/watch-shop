import { Link } from 'react-router-dom';

const Homepage = () => {
	return (
		<div>
			<h1>Welcome to Homepage</h1>
			<Link to='signin'>
				<button>Sign In</button>
			</Link>
		</div>
	);
};

export default Homepage;
