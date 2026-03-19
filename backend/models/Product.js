import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
	{
		variantId: {
			type: String,
			required: [true, 'Variant ID is required'],
			trim: true,
		},
		color: {
			type: String,
			required: [true, 'Variant color is required'],
			trim: true,
		},
		size: {
			type: Number,
			required: [true, 'Variant size is required'],
			min: [0, 'Size cannot be negative'],
		},
		stock: {
			type: Number,
			required: [true, 'Variant stock is required'],
			default: 0,
			min: [0, 'Stock cannot be negative'],
		},
		price: {
			type: Number,
			required: [true, 'Variant price is required'],
			min: [0, 'Price cannot be negative'],
		},
		mode: [
			{
				type: String,
				trim: true,
			},
		],
		images: [
			{
				type: String,
				trim: true,
			},
		],
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		_id: true,
	},
);

const productSchema = new mongoose.Schema(
	{
		productId: {
			type: String,
			required: [true, 'Product ID is required'],
			unique: true,
			trim: true,
			index: true,
		},
		name: {
			type: String,
			required: [true, 'Product name is required'],
			trim: true,
		},
		slug: {
			type: String,
			required: [true, 'Product slug is required'],
			unique: [true, 'Product slug already exists'],
			trim: true,
			lowercase: true,
		},
		brandId: {
			type: String,
			required: [true, 'Brand ID is required'],
			trim: true,
			index: true,
		},
		categoryId: {
			type: String,
			required: [true, 'Category ID is required'],
			trim: true,
			index: true,
		},
		variants: {
			type: [variantSchema],
			default: [],
			validate: {
				validator: function (value) {
					return Array.isArray(value) && value.length > 0;
				},
				message: 'At least one variant is required',
			},
		},
	},
	{
		timestamps: true,
	},
);

const Product = mongoose.model('Product', productSchema);
export default Product;
