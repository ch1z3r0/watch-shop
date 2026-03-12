import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
	{
		brandId: {
			type: String,
			required: [true, 'Brand ID is required'],
			unique: true,
			trim: true,
			index: true,
		},
		name: {
			type: String,
			required: [true, 'Brand name is required'],
			trim: true,
		},
		slug: {
			type: String,
			required: [true, 'Brand slug is required'],
			unique: true,
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	},
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
