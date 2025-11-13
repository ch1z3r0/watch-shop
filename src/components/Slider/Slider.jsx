import { useRef, useState, useEffect } from 'react';
import VideoSlide from './VideoSlide';

import './Slider.css';
import { ASSETS } from '../../utils/assets';

const Slider = () => {
	const { slide1, slide2, slide3, slide4 } = ASSETS;
	const sources = [slide1, slide2, slide3, slide4];

	const [index, setIndex] = useState(0);
	const lastIndex = sources.length - 1;
	const [autoAdvance, setAutoAdvance] = useState(true);

	const next = () => {
		setAutoAdvance(true);
		setIndex((i) => Math.min(i + 1, lastIndex));
	};

	const prev = () => {
		setAutoAdvance(false);
		setIndex((i) => Math.max(i - 1, 0));
	};
	// const goTo = (i) => setIndex(Math.max(0, Math.min(i, lastIndex)));

	// --- Scrollbar interactions ---
	const trackRef = useRef(null);
	const [dragging, setDragging] = useState(false);

	const toIndexFromClientX = (clientX) => {
		const track = trackRef.current;
		if (!track) return index;
		const rect = track.getBoundingClientRect();
		const frac = (clientX - rect.left) / rect.width; // 0..1
		const clamped = Math.max(0, Math.min(1, frac));
		return Math.round(clamped * lastIndex);
	};

	const onPointerDown = (e) => {
		e.preventDefault();
		setDragging(true);
		trackRef.current?.setPointerCapture?.(e.pointerId);
		setIndex(toIndexFromClientX(e.clientX));
	};

	const onPointerMove = (e) => {
		if (!dragging) return;
		setIndex(toIndexFromClientX(e.clientX));
	};

	const onPointerUp = (e) => {
		if (!dragging) return;
		setDragging(false);
		trackRef.current?.releasePointerCapture?.(e.pointerId);
	};

	const onTrackClick = (e) => {
		// (Optional) supports simple click-to-seek
		setIndex(toIndexFromClientX(e.clientX));
	};

	return (
		<div className='carousel-section'>
			<div className='carousel-container-wrap'>
				<div className='background-slider'>
					<video
						key={sources[index]} // force reload when src changes
						src={sources[index]}
						autoPlay
						muted
						loop
						playsInline
					/>
				</div>
				<div className='carousel-wrap'>
					<div className='carousel-container'>
						<div className='carousel slider'>
							<div className='slider-wrapper' style={{ '--index': index }}>
								{sources.map((src, i) => (
									<VideoSlide
										key={src || i}
										src={src}
										active={i === index}
										onEnded={autoAdvance ? next : undefined}
									/>
								))}
							</div>
						</div>

						<div className='carousel-navigation-wrap'>
							<button
								className='carousel-navigation-arrow carousel-navigation-prev'
								onClick={prev}
								aria-label='Previous slide'
								disabled={index === 0}
								// aria-disabled={index === 0}
							/>
							<button
								className='carousel-navigation-arrow carousel-navigation-next'
								onClick={next}
								aria-label='Next slide'
								disabled={index === lastIndex}
								// aria-disabled={index === lastIndex}
							/>
						</div>

						<div
							className='carousel-scrollbar'
							ref={trackRef}
							onClick={onTrackClick}
							onPointerDown={onPointerDown}
							onPointerMove={onPointerMove}
							onPointerUp={onPointerUp}
							role='slider'
							aria-label='Slide position'
							aria-valuemin={1}
							aria-valuemax={sources.length}
							aria-valuenow={index + 1}
							tabIndex={0}
						>
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
