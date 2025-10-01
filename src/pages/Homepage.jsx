import Navigation from '../components/Navigation/Navigation';
import { useEffect, useRef, useState } from 'react';

import './Homepage.css';

import { ASSETS } from '../utils/assets';
// import background1 from '../assets/images/background.jpg';

import Commercial from '../components/Commercial/Commercial';
import Banner from '../components/Banner/Banner';
import Slider from '../components/Slider/Slider';

const Homepage = () => {
	const { homepageBg } = ASSETS;
	return (
		<div className='homepage'>
			<img className='bg1' src={homepageBg} alt='Background Image 1' />
			<Navigation />
			<h1>Welcome to Commercial Section</h1>
			<Commercial />
			<h1>Welcome to Banner Section</h1>
			<Banner />
			<h1>Slider Section</h1>
			<Slider />
		</div>
	);
};

export default Homepage;
