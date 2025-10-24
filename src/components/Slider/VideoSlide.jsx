import { useEffect, useRef, useState } from 'react';

const VideoSlide = () => {
	const videoRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const [videoProgress, setVideoProgress] = useState(0);

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

	return <div>VideoSlide</div>;
};

export default VideoSlide;
