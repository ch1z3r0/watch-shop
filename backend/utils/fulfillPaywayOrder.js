import Order from '../models/Order.js';
import Product from '../models/Product.js';
import PendingPaywayOrder from '../models/PendingPaywayOrder.js';

export const fulfillPaywayOrder = async (tran_id) => {
	const existingOrder = await Order.findOne({ orderId: tran_id });
	if (existingOrder) {
		return { order: existingOrder, alreadyExisted: true };
	}

	const pending = await PendingPaywayOrder.findOne({ tran_id });
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

	return { order: newOrder, alreadyExisted: false };
};
