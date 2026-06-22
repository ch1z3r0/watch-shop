import Order from '../models/Order';
import Product from '../models/Product';
import { checkPayment, generateKHQR } from '../utils/bakong';
import generateUniqueId from '../utils/generateUniqueId';

export const createPayment = async (req, res) => {
	try {
		const { totalAmount, currency = 'usd' } = req.body;

		const orderId = await generateUniqueId('order');

		const { qrImage, md5 } = generateKHQR({
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

		const firebaseUid = req.body.uid;
		const customerEmail = req.body.email || '';

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
