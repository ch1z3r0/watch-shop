import Product from '../models/Product.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Counter from '../models/Counter.js';
import formatCode from './formatCode.js';

const modelMap = {
	product: { model: Product, field: 'productId', prefix: 'P' },
	variant: { model: Product, field: 'variants.variantId', prefix: 'V' },
	brand: { model: Brand, field: 'brandId', prefix: 'B' },
	category: { model: Category, field: 'categoryId', prefix: 'C' },
	order: { model: Order, field: 'orderId', prefix: 'ORD' },
};

const generateUniqueId = async (type) => {
	const { model, field, prefix } = modelMap[type];

	let id;
	let exists = true;

	while (exists) {
		// Get next sequence number
		const counter = await Counter.findByIdAndUpdate(
			type,
			{ $inc: { seq: 1 } },
			{ returnDocument: 'after', upsert: true },
		);

		id = formatCode(prefix, counter.seq);

		// Check if ID already exists
		exists = await model.exists({ [field]: id });
	}

	return id;
};

export default generateUniqueId;
