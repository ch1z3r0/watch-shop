import Order from '../models/Order.js';
import Product from '../models/Product.js';
import generateUniqueId from '../utils/generateUniqueId.js';

// --- Helpers -------------------------------------------------------------------------
//Rollback restore
const rollbackRestore = async (oldItems) => {
	for (const oldItem of oldItems) {
		const product = await Product.findOne({ productId: oldItem.productId });
		if (product) {
			const variant = product.variants.find(
				(v) => v.variantId === oldItem.variantId,
			);
			if (variant) {
				variant.stock -= oldItem.quantity; // undo the restore
				await product.save();
			}
		}
	}
};

// --- Get Order -----------------------------------------------------------------------
export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch order',
			error: error.message,
		});
	}
};

export const getOrderById = async (req, res) => {
	try {
		const order = await Order.findOne({ orderId: req.params.orderId });
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get order',
			error: error.message,
		});
	}
};

// --- Create Order -----------------------------------------------------------------------
export const createOrder = async (req, res) => {
	try {
		const {
			customerName,
			customerEmail,
			shippingAddress,
			phone,
			items,
			totalAmount,
			notes,
		} = req.body;

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
		const orderId = await generateUniqueId('order');

		const newOrder = await Order.create({
			orderId,
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

// --- Create Order -----------------------------------------------------------------------
export const createCustomerOrder = async (req, res) => {
	try {
		const { customerName, shippingAddress, phone, items, totalAmount, notes } =
			req.body;

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
		const orderId = await generateUniqueId('order');

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
// --- Update Order -----------------------------------------------------------------------
export const updateOrder = async (req, res) => {
	console.log('UPDATE ORDER HIT:', req.params.orderId);
	try {
		const {
			customerName,
			customerEmail,
			shippingAddress,
			phone,
			items,
			status,
			totalAmount,
			notes,
		} = req.body;
		const order = await Order.findOne({
			orderId: req.params.orderId,
		});
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// --- Restore stock for old items ---------------------------------------------------
		if (items !== undefined) {
			for (const oldItem of order.items) {
				const product = await Product.findOne({ productId: oldItem.productId });
				if (product) {
					const variant = product.variants.find(
						(v) => v.variantId === oldItem.variantId,
					);
					if (variant) {
						variant.stock += oldItem.quantity;
						await product.save();
					}
				}
			}
		}

		// --- Check and decrement stock for new items---------------------------------------------------
		if (items !== undefined) {
			for (const item of items) {
				const product = await Product.findOne({ productId: item.productId });

				if (!product) {
					await rollbackRestore(order.items);
					return res.status(404).json({ message: 'Product not found!' });
				}

				const variant = product.variants.find((v) => {
					return v.variantId === item.variantId;
				});

				if (!variant) {
					await rollbackRestore(order.items);
					return res.status(404).json({
						message: `Variant not found for product: ${item.productName}`,
					});
				}

				if (variant.stock < item.quantity) {
					await rollbackRestore(order.items);
					return res.status(400).json({
						message: `Not enough stock for ${item.productName} (${item.variantColor}). Available: ${variant.stock}, Requested: ${item.quantity}`,
					});
				}
			}
			// --- Stock decrement ---------------------------------------------------------
			for (const item of items) {
				const product = await Product.findOne({ productId: item.productId });
				const variant = product.variants.find(
					(v) => v.variantId === item.variantId,
				);
				variant.stock -= item.quantity;
				await product.save();
			}
		}

		// update only provided fields
		if (customerName !== undefined) order.customerName = customerName;
		if (customerEmail !== undefined) order.customerEmail = customerEmail;
		if (shippingAddress !== undefined) order.shippingAddress = shippingAddress;
		if (phone !== undefined) order.phone = phone;
		if (items !== undefined) order.items = items;
		if (status !== undefined) order.status = status;
		if (totalAmount !== undefined) order.totalAmount = totalAmount;
		if (notes !== undefined) order.notes = notes;

		const updatedOrder = await order.save();
		res.status(200).json(updatedOrder);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update order',
			error: error.message,
		});
	}
};

// --- Delete Order -----------------------------------------------------------------------
export const deleteOrder = async (req, res) => {
	try {
		const order = await Order.findOne({
			orderId: req.params.orderId,
		});
		if (!order) {
			return res.status(404).json({ message: 'Order not found' });
		}

		// Restore stock if order status is pending or processing
		if (order.status === 'Pending' || order.status === 'Processing') {
			for (const item of order.items) {
				const product = await Product.findOne({ productId: item.productId });
				if (product) {
					const variant = product.variants.find(
						(v) => (v.variantId = item.variantId),
					);
					if (variant) {
						variant.stock += item.quantity;
						await product.save();
					}
				}
			}
		}
		await Order.findOneAndDelete({ orderId: req.params.orderId });
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to delete order',
			error: error.message,
		});
	}
};
