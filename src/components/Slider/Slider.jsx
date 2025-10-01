import './Slider.css';
// import slide1 from '../../assets/videos/Explore Galaxy Watch Ultra_1.webm';
// import slide2 from '../../assets/videos/Explore Galaxy Watch Ultra_2.webm';
// import slide3 from '../../assets/videos/Explore Galaxy Watch Ultra_3.webm';
// import slide4 from '../../assets/videos/Explore Galaxy Watch Ultra_4.mp4';
import { ASSETS } from '../../utils/assets';
import { useRef, useState, useEffect } from 'react';

const Slider = () => {
	const { slide1, slide2, slide3, slide4 } = ASSETS;
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const handleVideoPlay = () => setIsPlaying(true);
	const handleVideoPause = () => setIsPlaying(false);
	const [videoProgress, setVideoProgress] = useState(0);

	useEffect(() => {
		const video = videoRef.current;
		const interval = setInterval(() => {
			if (!isNaN(video.currentTime)) {
				setVideoProgress((video.currentTime / video.duration) * 100);
				console.log(videoProgress);
			}
		}, 25);
		return () => clearInterval(interval);
	}, []);

	const videoDashStroke = 266 - (videoProgress * 266) / 100;

	const handlePlayPause = () => {
		const video = videoRef.current;
		// console.log(video.currentTime);

		if (video.paused) {
			video.play();
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	};
	return (
		<div className='carousel-section'>
			<div className='carousel-container-wrap'>
				<div className='carousel-container background-slider'></div>
				<div className='carousel-wrap'>
					<div className='carousel-container'>
						<div className='carousel slider'>
							<div className='slider-wrapper'>
								<div className='carousel-item'>
									<div className='video-container'>
										<video
											playsInline
											muted
											autoPlay
											ref={videoRef}
											onPlay={handleVideoPlay}
											onPause={handleVideoPause}
											// onTimeUpdate={handleVideoProgress}
										>
											<source src={slide1} type='video/webm' />
										</video>
										<button
											className='video-controller'
											onClick={handlePlayPause}
										>
											<svg className='progress-icon' viewBox='0 0 100 100'>
												<circle
													r='42'
													cx='50%'
													cy='50%'
													fill='transparent'
												></circle>
												<circle
													className='draw-line'
													r='42'
													cx='50%'
													cy='50%'
													fill='transparent'
													style={{
														strokeDashoffset: `${videoDashStroke}px`,
														transition: 'width easeIn 0s',
													}} //this is the status of the progress, max is 266
												></circle>
											</svg>
											<span
												className='video-controller-paused'
												style={{ display: isPlaying ? 'block' : 'none' }}
											></span>
											<span
												className='video-controller-playing'
												style={{ display: isPlaying ? 'none' : 'block' }}
											></span>
										</button>
									</div>
								</div>
								<div className='carousel-item'>
									<div className='video-container'>
										<video playsInline muted autoPlay>
											<source src={slide2} type='video/webm' />
										</video>
									</div>
								</div>
								<div className='carousel-item'>
									<div className='video-container'>
										<video playsInline muted autoPlay>
											<source src={slide3} type='video/webm' />
										</video>
									</div>
								</div>
								<div className='carousel-item'>
									<div className='video-container'>
										<video playsInline muted autoPlay>
											<source src={slide4} type='video/webm' />
										</video>
									</div>
								</div>
							</div>
						</div>
						<div className='carousel-navigation-wrap'>
							<button className='carousel-navigation-arrow carousel-navigation-prev'></button>
							<button className='carousel-navigation-arrow carousel-navigation-next'></button>
						</div>
						<div className='carousel-pagination-wrap'></div>
						<div className='carousel-scrollbar'>
							<div className='scrollbar-drag'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Slider;
