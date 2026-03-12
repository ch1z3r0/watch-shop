import express from 'express';
import {
	createBrand,
	deleteBrand,
	getAllBrands,
	getBrandsById,
	updateBrand,
} from '../controllers/brand.controller.js';

const router = express.Router();

//Get all brands
router.get('/', getAllBrands);

//Get one brand by id
router.get('/:brandId', getBrandsById);

//Create brand
router.post('/', createBrand);

//Update Brand
router.put('/:brandId', updateBrand);

//Delete Brand
router.delete('/:brandId', deleteBrand);

export default router;
