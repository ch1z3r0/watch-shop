const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
	{
		color: { type: String, required: true },
		case: { type: String },
		size: { type: Number },
		stock: { type: Number, default: 0 },
		price: { type: Number, required: true },
		mode: [{ type: String }],
		images: [{ type: String }],
		featured: { type: Boolean, default: false },
	},
	{ _id: true },
);

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true },
		brand_id: { type: String, required: true },
		description: { type: String, default: '' },
		variants: [variantSchema],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);
