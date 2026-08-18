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

const pendingPaywayOrderSchema = new mongoose.Schema(
	{
		tran_id: { type: String, required: true, unique: true },
		firebaseUid: { type: String, required: true },
		customerName: { type: String, required: true },
		customerEmail: { type: String, required: true },
		shippingAddress: { type: String, required: true },
		phone: { type: String, required: true },
		items: [orderItemSchema],
		totalAmount: { type: Number, required: true },
		notes: { type: String, default: '' },
	},
	{ timestamps: true },
);
pendingPaywayOrderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
const PendingPaywayOrder = mongoose.model(
	'PendingPaywayOrder',
	pendingPaywayOrderSchema,
);
export default PendingPaywayOrder;
