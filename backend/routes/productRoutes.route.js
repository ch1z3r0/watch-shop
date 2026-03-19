import express from 'express';
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductById,
	updateProduct,
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

export default router;
