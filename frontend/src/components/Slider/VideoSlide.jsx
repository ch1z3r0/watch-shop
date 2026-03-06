import { useEffect, useRef, useState, useMemo } from 'react';

// Ring constants
const R = 42;
const CIRC = 2 * Math.PI * R; // ≈ 263.89

const VideoSlide = ({ src, active, onEnded }) => {
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const v = videoRef.current;
		if (!v) return;

		if (active) {
			const p = v.play();
			if (p?.catch) p.catch(() => {}); // ignore autoplay policy rejections
			setIsPlaying(!v.paused);
		} else {
			v.pause();
			setIsPlaying(false);
			setProgress(0);
		}
	}, [active]);

	// Accurate progress via events
	const handleTimeUpdate = () => {
		const v = videoRef.current;
		if (!v || !Number.isFinite(v.duration) || v.duration === 0) return;
		setProgress((v.currentTime / v.duration) * 100);
	};

	const handleLoadedMetadata = () => handleTimeUpdate();

	const handlePlayPause = () => {
		const v = videoRef.current;
		if (!v) return;
		if (v.paused) {
			const p = v.play();
			if (p?.catch) p.catch(() => {});
			setIsPlaying(true);
		} else {
			v.pause();
			setIsPlaying(false);
		}
	};

	// (0 = full ring, 100 = empty ring)
	const strokeOffset = useMemo(
		() => ((100 - progress) / 100) * CIRC,
		[progress]
	);

	return (
		<div className='carousel-item' aria-hidden={!active}>
			<div className='video-container'>
				<video
					playsInline
					muted
					autoPlay
					ref={videoRef}
					onTimeUpdate={handleTimeUpdate}
					onLoadedMetadata={handleLoadedMetadata}
					onPlay={() => setIsPlaying(true)}
					onPause={() => setIsPlaying(false)}
					onEnded={onEnded}
				>
					<source src={src} type='video/webm' />
				</video>

				<button
					className='video-controller'
					onClick={handlePlayPause}
					aria-label={isPlaying ? 'Pause video' : 'Play video'}
				>
					<svg
						className='progress-icon'
						viewBox='0 0 100 100'
						role='img'
						aria-label='Video progress'
					>
						<circle
							r={R}
							cx='50'
							cy='50'
							fill='transparent'
							style={{
								strokeDasharray: `${CIRC}px`,
								strokeDashoffset: `${strokeOffset}px`,
								// transition: 'stroke-dashoffset 250ms linear',
							}}
						/>
						<circle
							className='draw-line'
							r={R}
							cx='50'
							cy='50'
							fill='transparent'
							style={{
								strokeDasharray: `${CIRC}px`,
								strokeDashoffset: `${strokeOffset}px`,
								transition: 'stroke-dashoffset 250ms linear',
							}}
						/>
					</svg>

					{/* When video is playing, show 'pause' icon; when paused, show 'play' icon */}
					<span
						className='video-controller-playing'
						style={{ display: isPlaying ? 'none' : 'block' }}
					/>
					<span
						className='video-controller-paused'
						style={{ display: isPlaying ? 'block' : 'none' }}
					/>
				</button>
			</div>
		</div>
	);
};

export default VideoSlide;
