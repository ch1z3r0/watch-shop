import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PendingKHQROrder from '../models/PendingKHQROrder.js';

export const fulfillKHQROrder = async (orderId) => {
	const existingOrder = await Order.findOne({ orderId });
	if (existingOrder) {
		return { order: existingOrder, alreadyExisted: true };
	}

	const pending = await PendingKHQROrder.findOne({ orderId });
	if (!pending) {
		throw new Error('No pending order found for this transaction.');
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
			throw new Error('Product not found!');
		}

		const variant = product.variants.find(
			(v) => v.variantId === item.variantId,
		);
		if (!variant) {
			throw new Error(`Variant not found for product: ${item.productName}`);
		}

		if (variant.stock < item.quantity) {
			throw new Error(
				`Not enough stock for ${item.productName} (${item.variantColor}). Available: ${variant.stock}, Requested: ${item.quantity}`,
			);
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

	await PendingKHQROrder.deleteOne({ orderId });

	return { order: newOrder, alreadyExisted: false };
};
