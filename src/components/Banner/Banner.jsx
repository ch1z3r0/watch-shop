import { ASSETS } from '../../utils/assets';
import './Banner.css';

const Banner = () => {
	const {
		bannerImg,
		bannerImgV2,
		galaxyWatchUltraTitle,
		galaxyWatchUltraTitleMo,
		galaxyAiText,
	} = ASSETS;
	return (
		<div className='banner-container'>
			<div className='banner-text'>
				{/* <strong> */}
				<picture>
					<source media='(min-width: 768px)' srcset={galaxyWatchUltraTitle} />
					<source media='(max-width: 767px)' srcset={galaxyWatchUltraTitleMo} />
					<img src={galaxyWatchUltraTitle} alt='Galaxy Watch Ultra Title' />
				</picture>
				{/* </strong> */}
				<div className='galaxy-ai-wrap'>
					<img src={galaxyAiText} alt='Galaxy AI' />
				</div>
				<p className='description'>
					Save up to $300+ on AI-powered adventuring. Plus, get an exclusive $50
					credit
				</p>
				<div className='banner-button-wrap'>
					<div className='buy-button'>
						<a href='https://www.samsung.com/us/watches/galaxy-watch-ultra-2025/buy/galaxy-watch-ultra-47mm-titanium-gray-sku-sm-l705uza1xaa/'>
							<span>Buy Now</span>
						</a>
					</div>
				</div>
			</div>
			<picture className='banner-img'>
				<source media='(min-width: 1081px)' srcSet={bannerImg} />
				<source media='(min-width: 768px)' srcSet={bannerImg} />
				<source media='(min-width: 535px)' srcSet={bannerImg} />
				<source media='(max-width: 534px)' srcSet={bannerImgV2} />
				<img src={bannerImg} alt='Galaxy Watch Ultra 2025' />
			</picture>
		</div>
	);
};

export default Banner;
