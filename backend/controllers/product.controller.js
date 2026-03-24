import Product from '../models/Product.js';
import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import getNextSequence from '../utils/getNextSequence.js';
import formatCode from '../utils/formatCode.js';

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find().sort({ createdAt: -1 });
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch product',
			error: error.message,
		});
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findOne({ productId: req.params.productId });
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to get product',
			error: error.message,
		});
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, slug, brandId, categoryId, variants } = req.body;

		//validation
		if (!name || !slug || !brandId || !categoryId) {
			return res.status(400).json({
				message: 'name, slug, brandId, and categoryId are required',
			});
		}
		if (!Array.isArray(variants) || variants.length === 0) {
			return res.status(400).json({
				message: 'At least one variant is required',
			});
		}

		//check if brand exists
		const brand = await Brand.findOne({ brandId });
		if (!brand) {
			res.status(404).json({
				message: 'Brand is not found',
			});
		}

		//check if category exists
		const category = await Category.findOne({ categoryId });
		if (!category) {
			res.status(404).json({
				message: 'Category is not found',
			});
		}

		const processedVariants = [];
		for (const variant of variants) {
			const nextVariantNumber = await getNextSequence('variant');
			const variantId = formatCode('V', nextVariantNumber);

			processedVariants.push({
				variantId,
				color: variant.color,
				size: variant.size,
				stock: variant.stock,
				price: variant.price,
				mode: variant.mode || [],
				images: variant.images || [],
				featured: variant.featured ?? false,
			});
		}

		const nextProductNumber = await getNextSequence('product');
		const productId = formatCode('P', nextProductNumber);

		const newProduct = await Product.create({
			productId,
			name,
			slug,
			brandId,
			categoryId,
			variants: processedVariants,
		});
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create product',
			error: error.message,
		});
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { name, slug, brandId, categoryId } = req.body;
		const product = await Product.findOne({
			productId: req.params.productId,
		});
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		}

		//Check for duplicate slug
		if (slug !== undefined && slug !== product.slug) {
			const existingSlug = await Product.findOne({
				slug,
				productId: { $ne: req.params.productId },
			});
			if (existingSlug) {
				return res.status(400).json({
					message: 'Slug already exists',
				});
			}
		}

		//Check for brand
		const brand = await Brand.findOne({ brandId: req.params.brandId });
		if (brandId !== undefined && !brand) {
			res.status(404).json({ message: 'Brand not found' });
		}

		//Check for category
		const category = await Category.findOne({ brandId: req.params.brandId });
		if (categoryId !== undefined && !category) {
			res.status(404).json({ message: 'Category not found' });
		}

		// update only provided fields
		if (name !== undefined) product.name = name;
		if (slug !== undefined) product.slug = slug;
		if (brandId !== undefined) product.brandId = brandId;
		if (categoryId !== undefined) product.categoryId = categoryId;

		const updateProduct = await product.save();
		res.status(200).json({});
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update product',
			error: error.message,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const deleteProduct = await Product.findOneAndDelete({
			productId: req.params.productId,
		});
		if (!deleteProduct) {
			res.status(404).json({ message: 'Product not found' });
		}
		res.status(200).json(deleteProduct);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to delete product',
			error: error.message,
		});
	}
};
