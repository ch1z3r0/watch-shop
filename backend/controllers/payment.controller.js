import Order from '../models/Order.js';
import PendingPaywayOrder from '../models/PendingPaywayOrder.js';
import Product from '../models/Product.js';
import { checkPayment, generateKHQR } from '../utils/bakong.js';
import generateUniqueId from '../utils/generateUniqueId.js';
import {
	buildPaywayCheckout,
	checkPaywayTransaction,
} from '../utils/payway.js';

export const createPayment = async (req, res) => {
	try {
		const { totalAmount, currency = 'usd' } = req.body;

		const orderId = await generateUniqueId('order');

		const { qrImage, md5 } = await generateKHQR({
			amount: totalAmount,
			currency,
			billNumber: orderId,
		});

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
		const {
			md5,
			orderId,
			customerName,
			shippingAddress,
			phone,
			items,
			totalAmount,
			notes,
		} = req.body;

		const result = await checkPayment(md5);

		// BAKONG status code 0 = paid, 1 = not yet paid
		if (result.responseCode !== 0) {
			return res.status(200).json({ paid: false });
		}

		// Check for existing order
		const existingOrder = await Order.findOne({ orderId });
		if (existingOrder) {
			return res.status(200).json({ paid: true, order: existingOrder });
		}

		const firebaseUid = req.user.uid;
		const customerEmail = req.user.email || '';

		// --- Validate all items first ---
		for (const item of items) {
			const product = await Product.findOne({ productId: item.productId });

			if (!product) {
				return res.status(404).json({ message: 'Product not found!' });
			}

			const variant = product.variants.find(
				(v) => v.variantId === item.variantId,
			);
			if (!variant) {
				return res.status(404).json({
					message: `Variant not found for product: ${item.productName}`,
				});
			}

			if (variant.stock < item.quantity) {
				return res.status(400).json({
					message: `Not enough stock for ${item.productName} (${item.variantColor}). Available: ${variant.stock}, Requested: ${item.quantity}`,
				});
			}
		}

		// --- All validated — now deduct stock ---
		for (const item of items) {
			const product = await Product.findOne({ productId: item.productId });
			const variant = product.variants.find(
				(v) => v.variantId === item.variantId,
			);
			variant.stock -= item.quantity;
			await product.save();
		}

		const newOrder = await Order.create({
			orderId,
			firebaseUid,
			customerName,
			customerEmail,
			shippingAddress,
			phone,
			items,
			totalAmount,
			notes,
		});
		res.status(201).json(newOrder);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create order',
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
		const { tran_id } = req.body;
		const result = await checkPaywayTransaction({ tran_id });

		if (result.data?.payment_status === 'APPROVED') {
			// Check if an order already exists for this transaction
			const existingOrder = await Order.findOne({ orderId: tran_id });
			if (existingOrder) {
				return res.status(200).json({ paid: true, order: existingOrder });
			}

			const pending = await PendingPaywayOrder.findOne({ tran_id });
			if (!pending) {
				return res
					.status(400)
					.json({ message: 'No Pending Order found for this transaction' });
			}
			const {
				firebaseUid,
				customerName,
				customerEmail,
				shippingAddress,
				phone,
				items,
				totalAmount,
				notes,
			} = pending;
			// --- Validate all items first ---
			for (const item of items) {
				const product = await Product.findOne({ productId: item.productId });

				if (!product) {
					return res.status(404).json({ message: 'Product not found!' });
				}

				const variant = product.variants.find(
					(v) => v.variantId === item.variantId,
				);
				if (!variant) {
					return res.status(404).json({
						message: `Variant not found for product: ${item.productName}`,
					});
				}

				if (variant.stock < item.quantity) {
					return res.status(400).json({
						message: `Not enough stock for ${item.productName} (${item.variantColor}). Available: ${variant.stock}, Requested: ${item.quantity}`,
					});
				}
			}
			// --- All validated — now deduct stock ---
			for (const item of items) {
				const product = await Product.findOne({ productId: item.productId });
				const variant = product.variants.find(
					(v) => v.variantId === item.variantId,
				);
				variant.stock -= item.quantity;
				await product.save();
			}

			const newOrder = await Order.create({
				orderId: tran_id,
				firebaseUid,
				customerName,
				customerEmail,
				shippingAddress,
				phone,
				items,
				totalAmount,
				notes,
			});

			await PendingPaywayOrder.deleteOne({ tran_id });

			return res.status(201).json({ paid: true, order: newOrder });
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
