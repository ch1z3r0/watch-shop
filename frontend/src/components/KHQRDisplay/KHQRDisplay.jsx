import { KHQRIcon } from '../../icons';
import './KHQRDisplay.css';

const KHQRDisplay = ({ qrImage, merchantName, amount, orderId }) => {
	return (
		<div className='khqr-template'>
			<div className='khqr-template__header'>
				<KHQRIcon className='khqr-template__logo-svg' />
			</div>

			<div className='khqr-template__info'>
				<p className='khqr-template__merchant'>{merchantName}</p>
				<p className='khqr-template__amount'>{amount}</p>
			</div>

			<div className='khqr-template__divider' />

			<div className='khqr-template__qr-wrap'>
				<img src={qrImage} alt='KHQR Payment' className='khqr-template__qr' />
			</div>

			<p className='khqr-template__ref'>Ref: {orderId}</p>
		</div>
	);
};

export default KHQRDisplay;
