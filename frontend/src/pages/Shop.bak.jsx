import { useAuth } from '../auth/AuthProvider';
import FullScreenLoader from '../components/FullScreenLoader';
import Navigation from '../components/Navigation/Navigation';
import { ASSETS } from '../utils/assets';
import './Shop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { byPrefixAndName } from '@awesome.me/kit-0f2939e7cf/icons';
import { useState } from 'react';

const tabs = [
	{ id: 1, name: 'New & Featured', icon: 'star', prefix: 'far' },
	{ id: 2, name: 'Samsung', icon: 'stripe-s', prefix: 'fab' },
	{ id: 3, name: 'Apple', icon: 'apple', prefix: 'fab' },
	{ id: 4, name: 'Google', icon: 'google', prefix: 'fab' },
];
const Shop = () => {
	// const { star } = ASSETS;
	const { user, isLoading } = useAuth();
	const [activeTab, setActiveTab] = useState('New & Featured');
	if (isLoading) return <FullScreenLoader message='Checking your session...' />;

	return (
		<div className='shop'>
			<div className='bg1'></div>
			<Navigation />
			<div className='shop-wrapper'>
				<div className='shop-content'>
					<h1 className='shop-title'>Pick Your Favorites</h1>
					<div className='shop-tab'>
						<div className='shop-tab-list'>
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={activeTab === tab.name ? 'is-active' : ''}
									onClick={() => setActiveTab(tab.name)}
								>
									<span className='tab-icon'>
										<FontAwesomeIcon
											icon={byPrefixAndName[tab.prefix][tab.icon]}
										/>
									</span>
									<span>{tab.name}</span>
								</button>
							))}
							{/* <button className='is-active'>
								<span className='tab-icon'>
									<FontAwesomeIcon icon={byPrefixAndName.far['star']} />
								</span>
								<span>New & Featured</span>
							</button>
							<button>
								<span className='tab-icon'>
									<FontAwesomeIcon icon={byPrefixAndName.fab['stripe-s']} />
								</span>
								<span>Samsung</span>
							</button>
							<button>
								<span className='tab-icon'>
									<FontAwesomeIcon icon={byPrefixAndName.fab['apple']} />
								</span>
								<span>Apple</span>
							</button>
							<button>
								<span className='tab-icon'>
									<FontAwesomeIcon icon={byPrefixAndName.fab['google']} />
								</span>
								<span>Google</span>
							</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shop;
