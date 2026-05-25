import Order from '../models/Order.js';
import Product from '../models/Product.js';
import getNextSequence from '../utils/getNextSequence.js';
import formatCode from '../utils/formatCode.js';

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
			res.status(404).json({ message: 'Order not found' });
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

		// --- Check and decrement stock ---------------------------------------------------
		for (const item of items) {
			const product = await Product.findOne({ productId: item.productId });

			if (!product) {
				return res.status(404).json({ message: 'Product not found!' });
			}

			const variant = await product.variants.find((v) => {
				v.variantId === item.variantId;
			});
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

			// --- Stock decrement ---------------------------------------------------------
			variant.stock -= item.quantity;
			await product.save();
		}
		const nextOrderNumber = await getNextSequence('order');
		const orderId = formatCode('ORD', nextOrderNumber);

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

// --- Update Order -----------------------------------------------------------------------
export const updateOrder = async (req, res) => {
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

// --- Update Order -----------------------------------------------------------------------
export const deleteOrder = async (req, res) => {
	try {
		const deletedOrder = await Order.findOneAndDelete({
			orderId: req.params.orderId,
		});
		if (!deletedOrder) {
			res.status(404).json({ message: 'Order not found' });
		}
		res.status(200).json(deletedOrder);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to delete order',
			error: error.message,
		});
	}
};
