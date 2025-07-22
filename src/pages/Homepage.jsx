import Navigation from '../components/Navigation/Navigation';
import { useEffect, useRef, useState } from 'react';

import './Homepage.css';

import background1 from '../assets/images/background.jpg';

import Commercial from '../components/Commercial/Commercial';
import Banner from '../components/Banner/Banner';
import Slider from '../components/Slider/Slider';

const Homepage = () => {
	return (
		<div className='homepage'>
			<img className='bg1' src={background1} alt='Background Image 1' />
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
