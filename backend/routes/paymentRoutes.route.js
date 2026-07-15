import express from 'express';
import verifyFirebaseToken from '../middleware/firebaseAuth.middleware.js';
import {
	checkPaymentStatus,
	createPayment,
	createPayWayCheckout,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create', verifyFirebaseToken, createPayment);

router.post('/check', verifyFirebaseToken, checkPaymentStatus);

router.post('/payway/checkout', verifyFirebaseToken, createPayWayCheckout);
router.post('/payway/webhook');

export default router;
