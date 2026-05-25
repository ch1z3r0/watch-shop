import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
	productId: { type: String, required: true },
	variantId: { type: String, required: true },
	productName: { type: String, required: true },
	variantColor: { type: String, required: true },
	size: { type: Number, required: true },
	case: { type: String, default: '' },
	image: { type: [String], default: '' },
	mode: { type: [String], default: '' },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
	{
		orderId: { type: String, required: true, unique: true },

		// Customer info
		customerName: { type: String, required: true },
		customerEmail: { type: String, required: true },
		shippingAddress: { type: String, required: true },
		phone: { type: String, required: true },

		// Items
		items: [orderItemSchema],

		// Financials
		totalAmount: { type: Number, required: true },

		// Status
		status: {
			type: String,
			enum: ['Pending', 'Processing', 'Delivering', 'Delivered', 'Cancelled'],
			default: 'Pending',
		},

		// Notes (optional, admin can add notes)
		notes: { type: String, default: '' },
	},
	{ timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
