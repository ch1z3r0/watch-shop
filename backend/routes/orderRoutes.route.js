import express from 'express';
import {
	createOrder,
	deleteOrder,
	getAllOrders,
	getOrderById,
	updateOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

//Get all brands
router.get('/', getAllOrders);

//Get one brand by id
router.get('/:orderId', getOrderById);

//Create brand
router.post('/', createOrder);

//Update Brand
router.patch('/:orderId', updateOrder);

//Delete Brand
router.delete('/:orderId', deleteOrder);

export default router;
