import {
	BakongKHQR,
	khqrData,
	IndividualInfo,
	MerchantInfo,
	SourceInfo,
} from 'bakong-khqr';
import QRCode from 'qrcode';
import axios from 'axios';

const getMerchantInfo = () => ({
	bakongAccountId: process.env.BAKONG_ACCOUNT_ID,
	merchantId: process.env.BAKONG_MERCHANT_ID,
	merchantName: process.env.BAKONG_MERCHANT_NAME,
	merchantBank: process.env.BAKONG_ACQUIRING_BANK,
	merchantCity: 'PHNOM PENH',
});

export const generateKHQR = async ({
	amount,
	currency = 'usd',
	billNumber,
}) => {
	const MERCHANT_INFO = getMerchantInfo();
	const optionalData = {
		expirationTimestamp: String(Date.now() + 5 * 60 * 1000),
		currency:
			currency === 'usd' ? khqrData.currency.usd : khqrData.currency.khr,
		amount,
		storeLabel: 'CHIRON',
		terminalLabel: 'Checkout',
		billNumber,
	};

	const merchantInfo = new MerchantInfo(
		MERCHANT_INFO.bakongAccountId,
		MERCHANT_INFO.merchantName,
		MERCHANT_INFO.merchantCity,
		MERCHANT_INFO.merchantId,
		MERCHANT_INFO.merchantBank,
		optionalData,
	);

	const KHQR = new BakongKHQR();
	const merchant = KHQR.generateMerchant(merchantInfo);

	if (merchant.status.code !== 0) {
		throw new Error(`KHQR generation failed: ${merchant.status.message}`);
	}

	// const qrImage = await QRCode.toDataURL(merchant.data.qr);

	const qrImage = await QRCode.toDataURL(merchant.data.qr, {
		width: 300,
		margin: 2,
		color: { dark: '#000000', light: '#ffffff' },
		errorCorrectionLevel: 'H',
	});

	return {
		qrString: merchant.data.qr,
		qrImage,
		md5: merchant.data.md5,
	};
};

export const checkPayment = async (md5) => {
	const res = await axios.post(
		`${process.env.BAKONG_API_URL}/v1/check_transaction_by_md5`,
		{ md5 },
		{
			headers: {
				Authorization: `Bearer ${process.env.BAKONG_TOKEN}`,
				'Content-Type': 'application/json',
			},
		},
	);
	return res.data;
};
