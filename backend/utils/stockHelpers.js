import Product from '../models/Product.js';

export const validateAndDeductStock = async (items, res) => {
	// --- Validate all items first ---
	for (const item of items) {
		const product = await Product.findOne({ productId: item.productId });

		if (!product) {
			throw new Error('Product not found!');
		}

		const variant = product.variants.find(
			(v) => v.variantId === item.variantId,
		);
		if (!variant) {
			throw new Error(`Variant not found for product: ${item.productName}`);
		}
		if (variant.stock < item.quantity) {
			throw new Error(
				`Not enough stock for ${item.productName} (${item.variantColor}). Available: ${variant.stock}, Requested: ${item.quantity}`,
			);
		}
	}

	// --- All validated — now deduct stock ---
	for (const item of items) {
		const product = await Product.findOne({ productId: item.productId });
		const variant = product.variants.find(
			(v) => v.variantId === item.variantId,
		);
		variant.stock -= item.quantity;
		await product.save();
	}
};

//Rollback restore
export const rollbackRestore = async (oldItems) => {
	for (const oldItem of oldItems) {
		const product = await Product.findOne({ productId: oldItem.productId });
		if (product) {
			const variant = product.variants.find(
				(v) => v.variantId === oldItem.variantId,
			);
			if (variant) {
				variant.stock += oldItem.quantity; // undo the restore
				await product.save();
			}
		}
	}
};
