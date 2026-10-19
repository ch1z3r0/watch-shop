import 'dotenv/config';
import mongoose from 'mongoose';

const DRY_RUN = process.argv.includes('--dry-run');

const run = async () => {
	await mongoose.connect(process.env.MONGO_URI);
	const products = mongoose.connection.db.collection('products');

	const docs = await products.find({}).toArray();
	console.log(`Found ${docs.length} products\n`);

	let productsChanged = 0;
	let variantsChanged = 0;
	const ops = [];

	for (const p of docs) {
		const $set = {};

		if (p.description === undefined) $set.description = '';
		if (p.isActive === undefined) $set.isActive = true;

		(p.variants || []).forEach((v, i) => {
			let touched = false;
			if (!v.sku) {
				$set[`variants.${i}.sku`] = `TEMP-${p.productId}-${v.variantId}`;
				touched = true;
			}
			if (v.specs === undefined) {
				$set[`variants.${i}.specs`] = {};
				touched = true;
			}
			if (v.isActive === undefined) {
				$set[`variants.${i}.isActive`] = true;
				touched = true;
			}
			if (touched) variantsChanged++;
		});

		if (Object.keys($set).length > 0) {
			productsChanged++;
			console.log(
				`${DRY_RUN ? '[dry-run] ' : ''}${p.productId}: ${Object.keys($set).length} field(s)`,
			);
			if (!DRY_RUN) {
				ops.push({ updateOne: { filter: { _id: p._id }, update: { $set } } });
			}
		}
	}

	if (!DRY_RUN && ops.length) {
		const res = await products.bulkWrite(ops);
		console.log(`\nbulkWrite modified: ${res.modifiedCount}`);
	}

	console.log(
		`\n${DRY_RUN ? '[dry-run] ' : ''}products touched: ${productsChanged}, variants touched: ${variantsChanged}`,
	);
	await mongoose.disconnect();
};

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
