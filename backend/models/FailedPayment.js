import mongoose from 'mongoose';

const failedPaymentSchema = new mongoose.Schema(
	{
		provider: {
			type: String,
			enum: ['khqr', 'payway', 'stripe'],
			required: true,
		},
		tran_id: { type: String, required: true },
		firebaseUid: { type: String, default: '' },
		customerEmail: { type: String, default: '' },
		paymentAmount: { type: Number, required: true },
		attemptedPayload: { type: Object, required: true },
		errorMessage: { type: String, required: true },
		resolved: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const FailedPayment = mongoose.model('FailedPayment', failedPaymentSchema);

export default FailedPayment;
