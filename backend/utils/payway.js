import axios from 'axios';
import crypto from 'crypto';
import FormData from 'form-data';
import { fulfillPaywayOrder } from './fulfillPaywayOrder.js';
import PendingPaywayOrder from '../models/PendingPaywayOrder.js';
import FailedPayment from '../models/FailedPayment.js';

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
	const payment_option = 'abapay_khqr';
	const items = '';
	const shipping = '0.00';
	const currency = 'USD';

	const return_url = process.env.PAYWAY_RETURN_URL;

	const cancel_url = process.env.PAYWAY_CANCEL_URL;

	const view_type = 'popup';

	const payment_gate = '0'; // NOT included in the hash, per docs
	const continue_success_url = '';
	const return_deeplink = '';
	const custom_fields = '';
	const return_params = '';
	const payout = '';
	const lifetime = '3';
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

const verifyWebhookSignature = (payload, receivedSignature) => {
	const API_KEY = process.env.PAYWAY_API_KEY;
	const sortedKeys = Object.keys(payload).sort();
	const concatenated = sortedKeys
		.map((key) => {
			const value = payload[key];
			return typeof value === 'object' && value != null
				? JSON.stringify(value)
				: value;
		})
		.join('');

	const expectedSignature = crypto
		.createHmac('sha512', API_KEY)
		.update(concatenated)
		.digest('base64');

	const a = Buffer.from(expectedSignature);
	const b = Buffer.from(receivedSignature || '');
	return a.length === b.length && crypto.timingSafeEqual(a, b);
};

export const paywayWebhookHandler = async (req, res) => {
	try {
		const signature = req.headers['x-payway-hmac-sha512'];
		const isValid = verifyWebhookSignature(req.body, signature);

		if (!isValid) return res.status(401).json({ message: 'Invalid signature' });

		const { tran_id } = req.body;

		const result = await checkPaywayTransaction({ tran_id });

		if (result.data?.payment_status === 'APPROVED') {
			try {
				await fulfillPaywayOrder(tran_id);
			} catch (error) {
				const pending = await PendingPaywayOrder.findOne({ tran_id });
				await FailedPayment.create({
					provider: 'payway',
					tran_id,
					firebaseUid: pending?.firebaseUid || '',
					customerEmail: pending?.customerEmail || '',
					paymentAmount: pending?.totalAmount || 0,
					attemptedPayload: pending || req.body,
					errorMessage: error.message,
					resolved: false,
				});
			}
		}
		return res.status(200).json({ received: true });
	} catch (error) {
		return res.status(500).json({ message: 'Webhook processing failed.' });
	}
};
