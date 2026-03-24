import express from 'express';
import {
	addVariant,
	createProduct,
	deleteProduct,
	deleteVariant,
	getAllProducts,
	getProductById,
	updateProduct,
	updateVariant,
} from '../controllers/product.controller.js';

const router = express.Router();

//Get all products
router.get('/', getAllProducts);

//Get product by Id
router.get('/:productId', getProductById);

//Create product
router.post('/', createProduct);

//Update product
router.put('/:productId', updateProduct);

//Delete product
router.delete('/:productId', deleteProduct);

//Variants
//Add variant
router.post('/:productId/variants/', addVariant);
//Update variant
router.put('/:productId/variants/:variantId', updateVariant);
//Delete variant
router.delete('/:productId/variants/:variantId', deleteVariant);

export default router;
