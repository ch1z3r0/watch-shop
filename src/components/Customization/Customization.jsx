import { useState } from 'react';
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

const tabs = ['marine', 'trail', 'peakForm'];

const Customization = () => {
	const [activeTab, setActiveTab] = useState('marine');

	const variant = variantsByTab[activeTab];
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
						<button href='' className='is-active'>
							<span>Marine</span>
						</button>
						<button href=''>
							<span>Trail</span>
						</button>
						<button href=''>
							<span>PeakForm</span>
						</button>
					</div>
					<div className='cus-items'></div>
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
