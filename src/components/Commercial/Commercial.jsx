import { useEffect, useRef, useState } from 'react';

import vid1 from '../../assets/videos/commercial.mp4';
// import play from '../../assets/icons/play-solid.svg';
// import pause from '../../assets/icons/pause-solid.svg';
// import mute from '../../assets/icons/volume-xmark-solid.svg';
// import unmute from '../../assets/icons/volume-solid.svg';
import { ASSETS } from '../../assets';

import './Commercial.css';

const Commercial = () => {
	const { play, pause, mute, unmute } = ASSETS;
	const videoRef = useRef(null);
	// const snappingRef = useRef(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [isMuted, setIsMuted] = useState(true);

	const handleVideoPlay = () => setIsPlaying(true);
	const handleVideoPause = () => setIsPlaying(false);

	const handlePlayPause = () => {
		const video = videoRef.current;
		if (video.paused) {
			video.play();
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	};

	const handleMute = () => {
		const video = videoRef.current;
		video.muted = !video.muted;
		setIsMuted(video.muted);
	};

	const videoPlayerRef = useRef(null);
	const minWidth = 80; // vw
	const maxWidth = 100; // vw
	const [width, setWidth] = useState(`${minWidth}vw`);

	const snapThreshold = 50;
	const minRadius = 0;
	const maxRadius = 3;
	const [borderRadius, setBorderRadius] = useState(`${maxRadius}rem`);

	// SCROLL ANIMATION LOGIC
	useEffect(() => {
		const handleScroll = () => {
			const player = videoPlayerRef.current;
			if (!player) return;

			const rect = player.getBoundingClientRect();
			const viewportCenter = window.innerHeight / 2;
			const playerCenter = rect.top + rect.height / 2;
			const distance = playerCenter - viewportCenter;
			const absDistance = Math.abs(distance);

			// If distance is more than 40% of viewport, shrink fully
			const maxDistance = window.innerHeight * 0.4;
			// progress = 1 when centered, 0 when far
			let progress = 1 - Math.min(absDistance / maxDistance, 1);

			// Interpolate between 80vw and 100vw
			if (absDistance < snapThreshold) {
				setWidth(`${maxWidth}vw`);
				setBorderRadius(`0rem`);
			} else {
				const widthValue = minWidth + (maxWidth - minWidth) * progress;

				const borderRadiusValue =
					minRadius + (maxRadius - minRadius) * (1 - progress);
				setWidth(`${widthValue}vw`);
				setBorderRadius(`${borderRadiusValue}rem`);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll);

		// Initial calculation
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, []);
	return (
		<div
			className='video-player'
			ref={videoPlayerRef}
			style={{
				width,
				borderRadius,
			}}
		>
			<video
				autoPlay
				loop
				muted={isMuted}
				ref={videoRef}
				onPlay={handleVideoPlay}
				onPause={handleVideoPause}
			>
				<source src={vid1} type='video/mp4' />
			</video>
			<div className='controls'>
				<button onClick={handlePlayPause}>
					<img
						className='play-button'
						src={isPlaying ? pause : play}
						alt='Play'
					/>
				</button>
				<button onClick={handleMute}>
					<img
						className='mute-button'
						src={isMuted ? mute : unmute}
						alt='Mute & Unmute Icon'
					/>
				</button>
			</div>
		</div>
	);
};

export default Commercial;
