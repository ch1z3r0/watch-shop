import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		firebaseUid: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
		},
		favourites: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true },
);

export default mongoose.model('User', userSchema);
