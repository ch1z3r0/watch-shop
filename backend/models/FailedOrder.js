import mongoose from 'mongoose';
const failedOrderSchema = new mongoose.Schema(
	{
		source: { type: String, enum: ['customer', 'admin'], required: true },
		firebaseUid: { type: String, default: '' },
		attemptedPayload: { type: Object, required: true },
		errorMessage: { type: String, required: true },
		stockRolledBack: { type: Boolean, default: false },
		resolved: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

const FailedOrder = mongoose.model('FailedOrder', failedOrderSchema);
export default FailedOrder;
