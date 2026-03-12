const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		categoryId: {
			type: String,
			required: [true, 'Category ID is required'],
			unique: true,
			trim: true,
			index: true,
		},
		name: {
			type: String,
			required: [true, 'Category name is required'],
			trim: true,
		},
		slug: {
			type: String,
			required: [true, 'Category slug is required'],
			unique: true,
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model('Category', categorySchema);
