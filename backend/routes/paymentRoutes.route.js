import express from 'express';
import verifyFirebaseToken from '../middleware/firebaseAuth.middleware.js';
import {
	checkPaymentStatus,
	checkPaywayTransactionStatus,
	createPayment,
	createPaywayCheckout,
} from '../controllers/payment.controller.js';
import { paywayWebhookHandler } from '../utils/payway.js';

const router = express.Router();

router.post('/create', verifyFirebaseToken, createPayment);

router.post('/check', verifyFirebaseToken, checkPaymentStatus);

router.post('/payway/checkout', verifyFirebaseToken, createPaywayCheckout);
router.post('/payway/check', verifyFirebaseToken, checkPaywayTransactionStatus);

router.post('/payway/webhook', paywayWebhookHandler);

export default router;
