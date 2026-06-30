import express from 'express';
import verifyFirebaseToken from '../middleware/firebaseAuth.middleware.js';
import {
	checkPaymentStatus,
	createPayment,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create', verifyFirebaseToken, createPayment);

router.post('/check', verifyFirebaseToken, checkPaymentStatus);

export default router;
