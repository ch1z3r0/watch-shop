import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';

const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID;
const API_KEY = process.env.PAYWAY_API_KEY;
const BASE_URL =
	process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh';

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
	const raw = parts.join('');
	console.log('  [hash debug] raw string being hashed:', JSON.stringify(raw));
	return crypto.createHmac('sha512', API_KEY).update(raw).digest('base64');
};

// Create PayWay Card transaction
const createCardTransaction = async () => {
	const req_time = getReqTime();
	const tran_id = `TEST-${Date.now()}`;
	const firstname = 'Long';
	const lastname = 'James';
	const email = 'jameslong@gmail.com';
	const phone = '85519837412';
	const type = 'purchase';
	const payment_option = 'cards';
	const items = '';
	const amount = '1.00';
	const currency = 'USD';

	const return_url = 'https://example.com/payway-return';

	const hash = buildHash([
		req_time,
		MERCHANT_ID,
		tran_id,
		amount,
		items,
		'0.00', // shipping
		firstname,
		lastname,
		email,
		phone,
		type,
		payment_option,
		return_url,
		'', // cancel_url
		'', // continue_success_url
		'', // return_deeplink
		currency,
		'', // custom_fields
		'', // return_params
		'', // payout
		'', // lifetime
		'', // additional_params
		'', // google_pay_token
		'', // skip_success_page
	]);

	const data = new FormData();
	data.append('req_time', req_time);
	data.append('merchant_id', MERCHANT_ID);
	data.append('tran_id', tran_id);
	data.append('firstname', firstname);
	data.append('lastname', lastname);
	data.append('email', email);
	data.append('phone', phone);
	data.append('type', type);
	data.append('payment_option', payment_option);
	data.append('items', items);
	data.append('shipping', '0.00');
	data.append('amount', amount);
	data.append('currency', currency);
	data.append('return_url', return_url);
	data.append('cancel_url', '');
	data.append('skip_success_page', '');
	data.append('continue_success_url', '');
	data.append('return_deeplink', '');
	data.append('custom_fields', '');
	data.append('return_params', '');
	data.append('view_type', '');
	data.append('payment_gate', '');
	data.append('payout', '');
	data.append('additional_params', '');
	data.append('lifetime', '');
	data.append('google_pay_token', '');
	data.append('hash', hash);

	console.log('--- Sending Create Transaction (cards) request ---');
	console.log({
		req_time,
		merchant_id: MERCHANT_ID,
		tran_id,
		firstname,
		lastname,
		email,
		phone,
		type,
		payment_option,
		items,
		amount,
	});

	const response = await axios.post(
		`${BASE_URL}/api/payment-gateway/v1/payments/purchase`,
		data,
		{ headers: data.getHeaders() },
	);

	console.log(JSON.stringify(response.data, null, 2));
	return { tran_id, req_time };
};
