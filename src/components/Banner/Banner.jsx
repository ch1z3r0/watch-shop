import { ASSETS } from '../../utils/assets';
import './Banner.css';

const Banner = () => {
	const { bannerImg, bannerImgV2 } = ASSETS;
	return (
		<div className='banner-container'>
			<div className='banner-text'>
				<strong>
					<span>GALAXY WATCH ULTRA</span>
				</strong>
			</div>
			<picture className='banner-image'>
				<source media='(min-width: 1081px)' srcSet={bannerImg} />
				<source media='(min-width: 768px)' srcSet={bannerImg} />
				<source media='(min-width: 361px)' srcSet={bannerImgV2} />
				<source media='(max-width: 360px)' srcSet={bannerImgV2} />
				<img src={bannerImg} alt='Galaxy Watch Ultra 2025' />
			</picture>
		</div>
	);
};

export default Banner;
