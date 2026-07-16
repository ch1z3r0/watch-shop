import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';

// Get request time that ABA wants
const getReqTime = () => {
	const now = new Date();
	// shift to UTC+7
	const d = new Date(now.getTime() + 7 * 60 * 60 * 1000);
	const pad = (n) => String(n).padStart(2, '0');
	return (
		d.getUTCFullYear().toString() +
		pad(d.getUTCMonth() + 1) +
		pad(d.getUTCDate()) +
		pad(d.getUTCHours()) +
		pad(d.getUTCMinutes()) +
		pad(d.getUTCSeconds())
	);
};

// Hash builder
const buildHash = (parts) => {
	const API_KEY = process.env.PAYWAY_API_KEY;
	const raw = parts.join('');
	console.log('  [hash debug] raw string being hashed:', JSON.stringify(raw));
	return crypto.createHmac('sha512', API_KEY).update(raw).digest('base64');
};

// Create PayWay Card transaction
export const buildPaywayCheckout = async ({
	amount,
	tran_id,
	firstname,
	lastname,
	email,
	phone,
}) => {
	const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID;
	const BASE_URL =
		process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh';

	const req_time = getReqTime();
	const merchant_id = MERCHANT_ID;
	const type = 'purchase';
	const payment_option = '';
	const items = '';
	const shipping = '0.00';
	const currency = 'USD';

	const return_url = Buffer.from(process.env.PAYWAY_RETURN_URL).toString(
		'base64',
	);
	const cancel_url = Buffer.from(process.env.PAYWAY_CANCEL_URL).toString(
		'base64',
	);

	const view_type = 'popup';

	const payment_gate = '0'; // NOT included in the hash, per docs
	const continue_success_url = '';
	const return_deeplink = '';
	const custom_fields = '';
	const return_params = '';
	const payout = '';
	const lifetime = '';
	const additional_params = '';
	const google_pay_token = '';
	const skip_success_page = '';

	const hash = buildHash([
		req_time,
		MERCHANT_ID,
		tran_id,
		amount,
		items,
		shipping,
		firstname,
		lastname,
		email,
		phone,
		type,
		payment_option,
		return_url,
		cancel_url,
		continue_success_url,
		return_deeplink,
		currency,
		custom_fields,
		return_params,
		payout,
		lifetime,
		additional_params,
		google_pay_token,
		skip_success_page,
	]);

	const res = {
		req_time,
		merchant_id,
		tran_id,
		firstname,
		lastname,
		email,
		phone,
		type,
		payment_option,
		items,
		shipping,
		amount,
		currency,
		return_url,
		cancel_url,
		skip_success_page,
		continue_success_url,
		return_deeplink,
		custom_fields,
		return_params,
		view_type,
		payment_gate,
		payout,
		additional_params,
		lifetime,
		google_pay_token,
		hash,
	};

	const action = `${BASE_URL}/api/payment-gateway/v1/payments/purchase`;

	return { action, fields: res };
};

export const checkPaywayTransaction = async ({ tran_id }) => {
	const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID;
	const BASE_URL =
		process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh';

	const req_time = getReqTime();
	const hash = buildHash([req_time, MERCHANT_ID, tran_id]);

	try {
		const res = await axios.post(
			`${BASE_URL}/api/payment-gateway/v1/payments/check-transaction-2`,
			{ req_time, merchant_id: MERCHANT_ID, tran_id, hash },
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		return res.data;
	} catch (error) {
		throw new Error(
			error.response?.data?.status?.message ||
				'Failed to check Payway Transaction.',
		);
	}
};
