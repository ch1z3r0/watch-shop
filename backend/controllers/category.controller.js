import Category from '../models/Category.js';
import getNextSequence from '../utils/getNextSequence.js';
import Counter from '../models/Counter.js';
import formatCode from '../utils/formatCode.js';

export const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ createdAt: -1 });
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch Categories',
			error: error.message,
		});
	}
};

export const getCategoryById = async (req, res) => {
	try {
		const category = await Category.findOne({
			categoryId: req.params.categoryId,
		});
		if (!category) {
			res.status(404).json({ message: 'Category not found' });
		}
		res.status(200).json(category);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch Category',
			error: error.message,
		});
	}
};

export const createCategory = async (req, res) => {
	try {
		const { name, slug } = req.body;
		const nextNumber = await getNextSequence('category');
		const categoryId = formatCode('C', nextNumber);
		const createCategory = await Category.create({ categoryId, name, slug });
		res.status(200).json(createCategory);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to create category',
			error: error.message,
		});
	}
};

export const updateCategory = async (req, res) => {
	try {
		const { name, slug } = req.body;
		const category = await Category.findOne({
			categoryId: req.params.categoryId,
		});
		if (!category) {
			res.status(404).json({ message: 'Category not found' });
		}
		category.name = name;
		category.slug = slug;

		const updateCategory = await category.save();
		res.status(200).json(updateCategory);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to update category',
			error: error.message,
		});
	}
};

export const deleteCategory = async (req, res) => {
	try {
		const deleteCategory = await Category.findOneAndDelete({
			categoryId: req.params.categoryId,
		});
		if (!deleteCategory) {
			res.status(404).json({ message: 'Category not found' });
		}
		res.status(200).json(deleteCategory);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to delete category',
			error: message.error,
		});
	}
};
