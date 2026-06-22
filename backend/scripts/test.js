import dotenv from 'dotenv';
dotenv.config();

import { generateKHQR, checkPayment } from '../utils/bakong.js';

const test = async () => {
	try {
		// Step 1 — generate QR
		const result = await generateKHQR({
			amount: 1.0,
			currency: 'usd',
			billNumber: 'TEST-001',
		});

		console.log('✅ QR generated');
		console.log('MD5:', result.md5);

		// Step 2 — immediately check payment status (should be unpaid)
		console.log('\nChecking payment status...');
		const paymentStatus = await checkPayment(result.md5);
		console.log(
			'Payment check result:',
			JSON.stringify(paymentStatus, null, 2),
		);
	} catch (err) {
		console.error('❌ Error:', err.message);
		console.error('Full error:', err.response?.data || err);
	}
};

test();
