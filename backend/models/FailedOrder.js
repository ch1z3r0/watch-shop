import mongoose from 'mongoose';
const failedOrderSchema = new mongoose.Schema(
	{
		firebaseUid: { type: String, default: '' },
		attemptedPayload: { type: Object, required: true },
		errorMessage: { type: String, required: true },
		resolved: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	},
);

const FailedOrder = mongoose.model('FailedOrder', failedOrderSchema);
export default FailedOrder;
