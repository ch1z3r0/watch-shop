import { useRef, useState, useEffect } from 'react';
import VideoSlide from './VideoSlide';

import './Slider.css';
import { ASSETS } from '../../utils/assets';

const Slider = () => {
	const { slide1, slide2, slide3, slide4 } = ASSETS;
	const sources = [slide1, slide2, slide3, slide4];
	// const videoRef = useRef(null);
	// const [isPlaying, setIsPlaying] = useState(true);
	// const handleVideoPlay = () => setIsPlaying(true);
	// const handleVideoPause = () => setIsPlaying(false);
	// const [videoProgress, setVideoProgress] = useState(0);

	const [index, setIndex] = useState(0);

	const wrap = (i) => {
		const len = sources.length;
		return ((i % len) + len) % len;
	};

	const next = () => setIndex((i) => wrap(i + 1));
	const prev = () => setIndex((i) => wrap(i - 1));
	const goTo = (i) => setIndex(wrap(i));

	// useEffect(() => {
	// 	const video = videoRef.current;
	// 	const interval = setInterval(() => {
	// 		if (!isNaN(video.currentTime)) {
	// 			setVideoProgress((video.currentTime / video.duration) * 100);
	// 		}
	// 	}, 25);
	// 	return () => clearInterval(interval);
	// }, []);

	// const videoDashStroke = 266 - (videoProgress * 266) / 100;

	// const handlePlayPause = () => {
	// 	const video = videoRef.current;

	// 	if (video.paused) {
	// 		video.play();
	// 		setIsPlaying(true);
	// 	} else {
	// 		video.pause();
	// 		setIsPlaying(false);
	// 	}
	// };

	return (
		<div className='carousel-section'>
			<div className='carousel-container-wrap'>
				<div className='carousel-container background-slider' />
				<div className='carousel-wrap'>
					<div className='carousel-container'>
						<div className='carousel slider'>
							{/* translate wrapper; CSS handles the transition */}
							<div
								className='slider-wrapper'
								/* style={{ transform: `translateX(-${index * 100}%)` }} */
								/* style={{ '--offset': `-${index * 50}%` }} */
								style={{ '--index': index }}
							>
								{sources.map((src, i) => (
									<VideoSlide
										key={src || i}
										src={src}
										active={i === index}
										onEnded={next}
									/>
								))}
							</div>
						</div>

						<div className='carousel-navigation-wrap'>
							<button
								className='carousel-navigation-arrow carousel-navigation-prev'
								onClick={prev}
								aria-label='Previous slide'
							/>
							<button
								className='carousel-navigation-arrow carousel-navigation-next'
								onClick={next}
								aria-label='Next slide'
							/>
						</div>

						<div
							className='carousel-pagination-wrap'
							role='tablist'
							aria-label='Slide pagination'
						>
							{sources.map((_, i) => (
								<button
									key={i}
									role='tab'
									aria-selected={i === index}
									className={`carousel-dot ${i === index ? 'is-active' : ''}`}
									onClick={() => goTo(i)}
								/>
							))}
						</div>

						<div className='carousel-scrollbar'>
							<div
								className='scrollbar-drag'
								style={{
									width: `${(100 / sources.length).toFixed(2)}%`,
									left: `${(index * 100) / sources.length}%`,
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Slider;
