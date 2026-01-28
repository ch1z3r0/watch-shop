import { useRef, useState, useEffect } from 'react';
import { ASSETS } from '../../utils/assets';
import './Customization.css';

const {
	galaxyWatchUltraMarine01,
	galaxyWatchUltraMarine02,
	galaxyWatchUltraMarine03,
	galaxyWatchUltraMarine04,
	galaxyWatchUltraMarine05,
	galaxyWatchUltraTrail01,
	galaxyWatchUltraTrail02,
	galaxyWatchUltraTrail03,
	galaxyWatchUltraTrail04,
	galaxyWatchUltraPeakForm01,
	galaxyWatchUltraPeakForm02,
	galaxyWatchUltraPeakForm03,
} = ASSETS;

const variantsByTab = {
	Marine: [
		{
			id: 'm-blue',
			name: 'Blue',
			color: '#2b3d63',
			img: galaxyWatchUltraMarine01,
		},
		{
			id: 'm-orange',
			name: 'Orange',
			color: '#ff7a1a',
			img: galaxyWatchUltraMarine02,
		},
		{
			id: 'm-gray',
			name: 'Dark Gray',
			color: '#2c2f36',
			img: galaxyWatchUltraMarine03,
		},
		{
			id: 'm-green',
			name: 'Green',
			color: '#3c4a3b',
			img: galaxyWatchUltraMarine04,
		},
		{
			id: 'm-white',
			name: 'White',
			color: '#ffffff',
			img: galaxyWatchUltraMarine05,
		},
	],
	Trail: [
		{
			id: 't-blue',
			name: 'Blue',
			color: '#2b3d63',
			img: galaxyWatchUltraTrail01,
		},
		{
			id: 't-orange',
			name: 'Orange',
			color: '#ff7a1a',
			img: galaxyWatchUltraTrail02,
		},
		{
			id: 't-gray',
			name: 'Dark Gray',
			color: '#2c2f36',
			img: galaxyWatchUltraTrail03,
		},
		{
			id: 't-white',
			name: 'White Sand',
			color: '#ffffff',
			img: galaxyWatchUltraTrail04,
		},
	],
	PeakForm: [
		{
			id: 'p-orange',
			name: 'Orange',
			color: '#ff7a1a',
			img: galaxyWatchUltraPeakForm01,
		},
		{
			id: 'p-gray',
			name: 'Dark Gray',
			color: '#2c2f36',
			img: galaxyWatchUltraPeakForm02,
		},
		{
			id: 'p-white',
			name: 'White Sand',
			color: '#ffffff',
			img: galaxyWatchUltraPeakForm03,
		},
	],
};

const tabs = ['Marine', 'Trail', 'PeakForm'];

const Customization = () => {
	const [activeTab, setActiveTab] = useState('Marine');

	const variants = variantsByTab[activeTab];

	const listRef = useRef(null);

	//State for checking left and right edge
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(true);

	const updateNav = () => {
		const el = listRef.current;
		if (!el) return;

		const eps = 2;

		const left = el.scrollLeft;
		const maxLeft = el.scrollWidth - el.clientWidth;

		setCanLeft(left > eps);
		setCanRight(left < maxLeft - eps);
	};

	useEffect(() => {
		const el = listRef.current;
		if (!el) return;

		// after render + images load, update nav visibility
		requestAnimationFrame(updateNav);

		const onScroll = () => updateNav();
		el.addEventListener('scroll', onScroll, { passive: true });

		// if images change size after load, nav needs recalculation
		window.addEventListener('resize', updateNav);

		return () => {
			el.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', updateNav);
		};
	}, [activeTab]);

	const scrollByCard = (dir) => {
		const el = listRef.current;
		if (!el) return;

		const card = el.querySelector('.cus-item');
		if (!card) return;

		//get Card width in pixels
		const cardW = card.getBoundingClientRect().width;

		//get gap in pixels
		const styles = window.getComputedStyle(el);
		const gapPx = parseFloat(styles.columnGap || styles.gap || '0') || 0;

		//calculate step
		const step = cardW + gapPx;
		el.scrollBy({ left: dir * step, behavior: 'smooth' });

		// update button visibility after scroll animation starts
		requestAnimationFrame(updateNav);
		setTimeout(updateNav, 250);
	};

	return (
		<div className='cus-wrapper'>
			<div className='cus-text'>
				<p className='eyebrows'>CUSTOMIZATION</p>
				<h2 className='title'>
					Bands for anything.
					<br />
					One UI for everything.
				</h2>
				<p className='description'>
					Gear up for every expedition with a range of band options for all
					terrains. With the new One UI 8 Watch, powered by an all-new
					processor, Galaxy Watch Ultra has you covered wherever you roam.
					<sup>4</sup>
				</p>
			</div>
			<div className='cus-content'>
				<div className='cus-tab'>
					<div className='cus-tab-list'>
						{tabs.map((tab) => (
							<button
								key={tab}
								type='button'
								className={activeTab === tab ? 'is-active' : ''}
								onClick={() => setActiveTab(tab)}
							>
								<span>{tab}</span>
							</button>
						))}
					</div>
					<div className='cus-items-wrap'>
						{canLeft && (
							<button
								type='button'
								className='cus-nav cus-nav--left carousel-navigation-arrow carousel-navigation-prev'
								onClick={() => scrollByCard(-1)}
								aria-label='Previous'
							>
								{/* ‹ */}
							</button>
						)}
						<div className='cus-items' ref={listRef}>
							{variants.map((v) => (
								<div key={v.id} className='cus-item'>
									<img src={v.img} alt={v.name} className='cus-watch' />
									<div className='cus-variant-info'>
										<span
											className='cus-dot'
											style={{ background: v.color }}
										></span>
										<span className='cus-name'>{v.name}</span>
									</div>
								</div>
							))}
						</div>
						{canRight && (
							<button
								type='button'
								className='cus-nav cus-nav--right carousel-navigation-arrow carousel-navigation-next'
								onClick={() => scrollByCard(1)}
								aria-label='Next'
							>
								{/* › */}
							</button>
						)}
					</div>
				</div>
				<div className='buy-button-wrap'>
					<div className='buy-button'>
						<a href='https://www.samsung.com/us/watches/galaxy-watch-ultra-2025/buy/galaxy-watch-ultra-47mm-titanium-gray-sku-sm-l705uza1xaa/'>
							<span>Buy Now</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Customization;
