import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const DEFAULT_HEX = '#888888';

const run = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	console.log('Connected to MongoDB');

	const products = await Product.find({});
	let updatedCount = 0;

	for (const product of products) {
		let changed = false;

		product.variants.forEach((variant) => {
			if (!variant.colorHex) {
				variant.colorHex = DEFAULT_HEX;
				changed = true;
			}
		});

		if (changed) {
			await product.save();
			updatedCount++;
			console.log(`Updated: ${product.name}`);
		}
	}

	console.log(`\nDone. ${updatedCount} product(s) updated.`);
	await mongoose.disconnect();
};

run().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
