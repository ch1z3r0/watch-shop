import FailedPayment from '../models/FailedPayment.js';
import Order from '../models/Order.js';
import PendingKHQROrder from '../models/PendingKHQROrder.js';
import PendingPaywayOrder from '../models/PendingPaywayOrder.js';
import Product from '../models/Product.js';
import { checkPayment, generateKHQR } from '../utils/bakong.js';
import { fulfillKHQROrder } from '../utils/fulfillKHQROrder.js';
import { fulfillPaywayOrder } from '../utils/fulfillPaywayOrder.js';
import generateUniqueId from '../utils/generateUniqueId.js';
import {
	buildPaywayCheckout,
	checkPaywayTransaction,
} from '../utils/payway.js';

const pollKhqrPaymentServerSide = (orderId, md5) => {
	const startTime = Date.now();
	const TIMEOUT_MS = 3 * 60 * 1000;

	const interval = setInterval(async () => {
		if (Date.now() - startTime >= TIMEOUT_MS) {
			clearInterval(interval);
			return;
		}

		try {
			const result = await checkPayment(md5);
			if (result.responseCode === 0) {
				clearInterval(interval);
				try {
					await fulfillKHQROrder(orderId);
				} catch (error) {
					const pending = await PendingKHQROrder.findOne({ orderId });
					await FailedPayment.create({
						provider: 'khqr',
						tran_id: orderId,
						firebaseUid: pending?.firebaseUid || '',
						customerEmail: pending?.customerEmail || '',
						paymentAmount: pending?.totalAmount || 0,
						attemptedPayload: pending || {},
						errorMessage: error.message,
						resolved: false,
					});
				}
			}
		} catch (error) {
			console.error('Server-side KHQR poll error:', error);
		}
	}, 3000);
};

export const createPayment = async (req, res) => {
	try {
		const {
			totalAmount,
			currency = 'usd',
			customerName,
			customerEmail: formEmail,
			shippingAddress,
			phone,
			items,
			notes,
		} = req.body;

		const firebaseUid = req.user.uid;
		const customerEmail = req.user.email || formEmail || '';
		const orderId = await generateUniqueId('order');

		const { qrImage, md5 } = await generateKHQR({
			amount: totalAmount,
			currency,
			billNumber: orderId,
		});

		await PendingKHQROrder.create({
			orderId,
			md5,
			firebaseUid: req.user.uid,
			customerName,
			customerEmail,
			shippingAddress,
			phone,
			items,
			totalAmount,
			notes,
		});

		pollKhqrPaymentServerSide(orderId, md5);
		res.status(200).json({ orderId, qrImage, md5 });
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create payment',
			error: error.message,
		});
	}
};

export const checkPaymentStatus = async (req, res) => {
	try {
		const { md5, orderId } = req.body;
		const firebaseUid = req.user.uid;

		const result = await checkPayment(md5);

		// BAKONG status code 0 = paid, 1 = not yet paid
		if (result.responseCode !== 0) {
			return res.status(200).json({ paid: false });
		}

		try {
			const { order } = await fulfillKHQROrder(orderId);
			return res.status(201).json({ paid: true, order });
		} catch (error) {
			const pending = await PendingKHQROrder.findOne({ orderId });

			await FailedPayment.create({
				provider: 'khqr',
				tran_id: orderId,
				firebaseUid,
				customerEmail: pending?.customerEmail || '',
				paymentAmount: pending?.totalAmount || 0,
				attemptedPayload: pending || req.body,
				errorMessage: error.message,
				resolved: false,
			});
			return res.status(200).json({
				paid: false,
				failed: true,
				message:
					'Payment received, but we could not complete your order. Our team will contact you shortly.',
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to check KHQR payment status.',
			error: error.message,
		});
	}
};

// --- PAYWAY ------------------------------------------------------------
export const createPaywayCheckout = async (req, res) => {
	try {
		const {
			amount,
			firstname,
			lastname,
			email,
			phone,
			shippingAddress,
			items,
			totalAmount,
			notes,
		} = req.body;
		const tran_id = await generateUniqueId('order');

		const result = await buildPaywayCheckout({
			amount,
			tran_id,
			firstname,
			lastname,
			email,
			phone,
		});

		await PendingPaywayOrder.create({
			tran_id,
			firebaseUid: req.user.uid,
			customerName: `${firstname} ${lastname}`,
			customerEmail: email,
			shippingAddress,
			phone,
			items,
			totalAmount,
			notes,
		});

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to create PayWay checkout.',
			error: error.message,
		});
	}
};

export const checkPaywayTransactionStatus = async (req, res) => {
	try {
		const firebaseUid = req.user.uid;
		const { tran_id } = req.body;
		const result = await checkPaywayTransaction({ tran_id });

		// Error/failure shape — no `data`, just a top-level status object
		if (!result.data && result.status?.code !== '00') {
			return res.status(200).json({
				paid: false,
				failed: true,
				message: result.status?.message || 'Payment failed.',
			});
		}

		if (result.data?.payment_status === 'APPROVED') {
			try {
				const { order } = await fulfillPaywayOrder(tran_id);
				return res.status(201).json({ paid: true, order });
			} catch (error) {
				const pending = await PendingPaywayOrder.findOne({ tran_id });
				await FailedPayment.create({
					provider: 'payway',
					tran_id,
					firebaseUid,
					customerEmail: pending?.customerEmail || '',
					paymentAmount: result.data?.total_amount || 0,
					attemptedPayload: pending || req.body,
					errorMessage: error.message,
					resolved: false,
				});
				return res.status(200).json({
					paid: false,
					failed: true,
					message:
						'Payment received, but we could not complete your order. Our team will contact you shortly.',
				});
			}
		}

		if (
			result.data?.payment_status === 'DECLINED' ||
			result.data?.payment_status === 'CANCELLED'
		) {
			return res.status(200).json({
				paid: false,
				failed: true,
				message: 'Payment was declined or cancelled.',
			});
		}

		return res
			.status(200)
			.json({ paid: false, status: result.data?.payment_status });
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to check PayWay payment status.',
			error: error.message,
		});
	}
};
