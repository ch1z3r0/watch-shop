import Navigation from '../components/Navigation/Navigation';
import { useEffect, useRef, useState } from 'react';

import './Homepage.css';

import { ASSETS } from '../utils/assets';
// import background1 from '../assets/images/background.jpg';

import Commercial from '../components/Commercial/Commercial';
import Banner from '../components/Banner/Banner';
import Slider from '../components/Slider/Slider';
import { useAuth } from '../components/AuthProvider';

const Homepage = () => {
	const { homepageBg } = ASSETS;
	const { user, isLoading } = useAuth();
	if (isLoading) return <div>Loading...</div>;
	return (
		<div className='homepage'>
			{/* <img className='bg1' src={homepageBg} alt='Background Image 1' /> */}
			<div className='bg1'></div>
			<Navigation />
			{/* <h1>Welcome to Banner Section</h1> */}
			<Banner />
			<div className='title-wrap'>
				<h2 className='common title'>
					The toughest
					<br />
					Galaxy Watch ever
				</h2>
			</div>
			<Commercial />
			<h1>Slider Section</h1>
			<Slider />
		</div>
	);
};

export default Homepage;
