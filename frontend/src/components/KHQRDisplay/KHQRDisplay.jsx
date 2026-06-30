import { KHQRLogoWhite } from '../../icons';
import './KHQRDisplay.css';

const KHQRDisplay = ({ qrImage, merchantName, amount, currency = 'USD' }) => {
	return (
		<div className='khqr-card'>
			{/* Red header */}
			<div className='khqr-card__header'>
				<KHQRLogoWhite className='khqr-card__logo' />
				<div className='khqr-card__notch' />
			</div>

			{/* Merchant info */}
			<div className='khqr-card__info'>
				<p className='khqr-card__merchant'>{merchantName}</p>
				<p className='khqr-card__amount'>
					{amount} <span className='khqr-card__currency'>{currency}</span>
				</p>
			</div>

			{/* Dashed divider */}
			<div className='khqr-card__divider' />

			{/* QR with center badge */}
			<div className='khqr-card__qr-section'>
				<div className='khqr-card__qr-wrap'>
					<img src={qrImage} alt='KHQR Payment' className='khqr-card__qr' />
					<div className='khqr-card__badge'>
						<svg
							viewBox='0 0 40 40'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle cx='20' cy='20' r='20' fill='#1a1a1a' />
							<text
								x='20'
								y='27'
								textAnchor='middle'
								fontSize='20'
								fontWeight='700'
								fill='white'
								fontFamily='Arial, "Times New Roman", serif'
							>
								$
							</text>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default KHQRDisplay;
