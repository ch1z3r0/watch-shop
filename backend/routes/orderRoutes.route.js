import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.middleware.js';
import {
	createCustomerOrder,
	createOrder,
	deleteOrder,
	getAllOrders,
	getOrderById,
	updateOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

//Get all orders
router.get('/', getAllOrders);

//Get one order by id
router.get('/:orderId', getOrderById);

//Create order
router.post('/', createOrder);

// Create customer order
router.post('/checkout', verifyFirebaseToken, createCustomerOrder);

//Update order
router.patch('/:orderId', updateOrder);

//Delete order
router.delete('/:orderId', deleteOrder);

export default router;
