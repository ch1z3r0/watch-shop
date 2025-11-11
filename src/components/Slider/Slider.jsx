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
	const goTo = (i) => setIndex(Math.max(0, Math.min(i, lastIndex)));

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

						{/* <div
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
						</div> */}

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
