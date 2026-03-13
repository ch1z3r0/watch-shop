import Brand from '../models/Brand.js';
import getNextSequence from '../utils/getNextSequence.js';
import formatCode from '../utils/formatCode.js';

export const getAllBrands = async (req, res) => {
	try {
		const brands = await Brand.find().sort({ createdAt: -1 });
		res.status(200).json(brands);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch brands',
			error: error.message,
		});
	}
};
export const getBrandsById = async (req, res) => {
	try {
		const brand = await Brand.findOne({ brandId: req.params.brandId });

		if (!brand) {
			return res.status(404).json({ message: 'Brand not found' });
		}

		res.status(200).json(brand);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to fetch brand',
			error: error.message,
		});
	}
};

export const createBrand = async (req, res) => {
	try {
		const { name, slug } = req.body;
		const nextNumber = await getNextSequence('brand');
		const brandId = formatCode('B', nextNumber);

		const brand = await Brand.create({
			brandId,
			name,
			slug,
		});
		res.status(201).json(brand);
	} catch (error) {
		res.status(400).json({
			message: 'Failed to create brand',
			error: error.message,
		});
	}
};

export const updateBrand = async (req, res) => {
	try {
		const { name, slug } = req.body;
		const brand = await Brand.findOne({ brandId: req.params.brandId });
		if (!brand) {
			return res.status(404).json({ message: 'Brand not found' });
		}
		brand.name = name;
		brand.slug = slug;
		const updateBrand = await brand.save();
		res.status(200).json(updateBrand);
	} catch (error) {
		res.status(400).json({
			message: 'Failed to update brand',
			error: error.message,
		});
	}
};

export const deleteBrand = async (req, res) => {
	try {
		const deleteBrand = await Brand.findOneAndDelete({
			brandId: req.params.brandId,
		});
		if (!deleteBrand) {
			return res.status(404).json({ message: 'Brand not found' });
		}
		res.status(200).json(deleteBrand);
	} catch (error) {
		res.status(500).json({
			message: 'Failed to delete brand',
			error: error.message,
		});
	}
};
