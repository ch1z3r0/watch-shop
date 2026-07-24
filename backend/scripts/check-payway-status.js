// backend/scripts/check-payway-status.js
import dotenv from 'dotenv';
dotenv.config();

import { checkPaywayTransaction } from '../utils/payway.js';

const tran_id = process.argv[2]; // pass tran_id as CLI arg

if (!tran_id) {
	console.error('Usage: node scripts/check-payway-status.js <tran_id>');
	process.exit(1);
}

const run = async () => {
	try {
		const result = await checkPaywayTransaction({ tran_id });
		console.log(JSON.stringify(result, null, 2));
	} catch (err) {
		console.error('Error:', err.message);
	}
};

run();
