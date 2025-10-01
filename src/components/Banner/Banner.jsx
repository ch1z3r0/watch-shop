import { ASSETS } from '../../utils/assets';

const Banner = () => {
	const { bannerImg } = ASSETS;
	return (
		<div className='banner-container'>
			<img src={bannerImg} alt='Galaxy Watch Ultra' />
		</div>
	);
};

export default Banner;
