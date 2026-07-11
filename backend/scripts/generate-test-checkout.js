// backend/scripts/generate-test-checkout.js
//
// Generates a fresh signed PayWay transaction and writes out a
// standalone HTML file (test-checkout.html) with the checkout2-0.js
// popup wired up and all fields already filled in.
//
// Run with: node scripts/generate-test-checkout.js
// Then just double-click the generated test-checkout.html to open it
// in your browser and test a real card payment against sandbox.
//
// Required .env vars (same as your existing test-payway.js):
//   PAYWAY_MERCHANT_ID=your_sandbox_merchant_id
//   PAYWAY_API_KEY=your_sandbox_api_key
//   PAYWAY_API_URL=https://checkout-sandbox.payway.com.kh   (optional, defaults to sandbox)

import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID;
const API_KEY = process.env.PAYWAY_API_KEY;
const BASE_URL =
	process.env.PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh';

if (!MERCHANT_ID || !API_KEY) {
	console.error('❌ Missing PAYWAY_MERCHANT_ID or PAYWAY_API_KEY in .env');
	process.exit(1);
}

// Get request time that ABA wants — UTC+7, format YYYYMMDDHHmmss
const getReqTime = () => {
	const now = new Date();
	const d = new Date(now.getTime() + 7 * 60 * 60 * 1000);
	const pad = (n) => String(n).padStart(2, '0');
	return (
		d.getUTCFullYear().toString() +
		pad(d.getUTCMonth() + 1) +
		pad(d.getUTCDate()) +
		pad(d.getUTCHours()) +
		pad(d.getUTCMinutes()) +
		pad(d.getUTCSeconds())
	);
};

const buildHash = (parts) => {
	const raw = parts.join('');
	console.log('[hash debug] raw string being hashed:', JSON.stringify(raw));
	return crypto.createHmac('sha512', API_KEY).update(raw).digest('base64');
};

// --- Build the transaction fields ---
const req_time = getReqTime();
const tran_id = `TEST-${Date.now()}`;
const firstname = 'Long';
const lastname = 'James';
const email = 'jameslong@gmail.com';
const phone = '85519837412';
const type = 'purchase';
// Left empty on purpose — matches ABA's own reference example, lets the
// checkout popup show all enabled methods (card, ABA Pay, KHQR) instead
// of forcing a single one via the API param.
const payment_option = '';
const items = '';
const shipping = '0.00';
const amount = '1.00';
const currency = 'USD';
// PayWay expects return_url / cancel_url base64-encoded — confirmed from
// a working reference implementation. Plain URLs were likely breaking
// the hosted checkout page generation server-side.
const return_url = Buffer.from('https://example.com/payway-return').toString(
	'base64',
);
const cancel_url = Buffer.from('https://example.com/payway-cancel').toString(
	'base64',
);
const payment_gate = '0'; // NOT included in the hash, per docs
const continue_success_url = '';
const return_deeplink = '';
const custom_fields = '';
const return_params = '';
const payout = '';
const lifetime = '';
const additional_params = '';
const google_pay_token = '';
const skip_success_page = '';

// Hash field order confirmed from developer.payway.com.kh/purchase-14530820e0 —
// NOTE: view_type and payment_gate are NOT included in the hash.
const hash = buildHash([
	req_time,
	MERCHANT_ID,
	tran_id,
	amount,
	items,
	shipping,
	firstname,
	lastname,
	email,
	phone,
	type,
	payment_option,
	return_url,
	cancel_url,
	continue_success_url,
	return_deeplink,
	currency,
	custom_fields,
	return_params,
	payout,
	lifetime,
	additional_params,
	google_pay_token,
	skip_success_page,
]);

const purchaseUrl = `${BASE_URL}/api/payment-gateway/v1/payments/purchase`;

console.log('--- Generated transaction ---');
console.log({ req_time, tran_id, amount, currency });

// --- Build the HTML file ---
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>PayWay Sandbox Card Test</title>
  <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js" defer></script>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 480px;
      margin: 60px auto;
      padding: 0 20px;
      color: #222;
    }
    h1 { font-size: 1.25rem; }
    .details {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      font-size: 0.85rem;
      margin-bottom: 24px;
    }
    .details div { margin-bottom: 4px; }
    button {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      background: #111;
      color: #fff;
      cursor: pointer;
    }
    button:hover { background: #333; }
    .note {
      font-size: 0.8rem;
      color: #888;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <h1>PayWay Sandbox — Card Test</h1>

  <div class="details">
    <div><strong>tran_id:</strong> ${tran_id}</div>
    <div><strong>amount:</strong> ${amount} ${currency}</div>
    <div><strong>req_time:</strong> ${req_time}</div>
  </div>

  <form
    id="aba_merchant_request"
    method="POST"
    target="aba_webservice"
    action="${purchaseUrl}"
  >
    <input type="hidden" name="req_time" value="${req_time}" />
    <input type="hidden" name="merchant_id" value="${MERCHANT_ID}" />
    <input type="hidden" name="tran_id" value="${tran_id}" />
    <input type="hidden" name="firstname" value="${firstname}" />
    <input type="hidden" name="lastname" value="${lastname}" />
    <input type="hidden" name="email" value="${email}" />
    <input type="hidden" name="phone" value="${phone}" />
    <input type="hidden" name="type" value="${type}" />
    <input type="hidden" id="payment_option" name="payment_option" value="${payment_option}" />
    <input type="hidden" name="items" value="${items}" />
    <input type="hidden" name="shipping" value="${shipping}" />
    <input type="hidden" name="amount" value="${amount}" />
    <input type="hidden" name="currency" value="${currency}" />
    <input type="hidden" name="return_url" value="${return_url}" />
    <input type="hidden" name="cancel_url" value="${cancel_url}" />
    <input type="hidden" name="continue_success_url" value="${continue_success_url}" />
    <input type="hidden" name="return_deeplink" value="${return_deeplink}" />
    <input type="hidden" name="custom_fields" value="${custom_fields}" />
    <input type="hidden" name="return_params" value="${return_params}" />
    <input type="hidden" name="payout" value="${payout}" />
    <input type="hidden" name="lifetime" value="${lifetime}" />
    <input type="hidden" name="additional_params" value="${additional_params}" />
    <input type="hidden" name="google_pay_token" value="${google_pay_token}" />
    <input type="hidden" name="skip_success_page" value="${skip_success_page}" />
    <input type="hidden" name="view_type" value="popup" />
    <input type="hidden" name="payment_gate" value="${payment_gate}" />
    <input type="hidden" name="hash" value="${hash}" />

    <button type="submit">Open PayWay Checkout</button>
  </form>

  <script>
    var form = document.getElementById('aba_merchant_request');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (typeof AbaPayway === 'undefined') {
        alert('PayWay checkout script is still loading — please wait a second and try again.');
        return;
      }
      AbaPayway.checkout();
    });
  </script>

  <p class="note">
    This transaction was generated at ${new Date().toISOString()}.
    The hash is time-sensitive — if this page sits open too long before you
    click the button, re-run <code>generate-test-checkout.js</code> to get a
    fresh one.
  </p>
</body>
</html>
`;

const outputPath = path.join(__dirname, 'test-checkout.html');
fs.writeFileSync(outputPath, html);

console.log(`\n✅ Wrote ${outputPath}`);
console.log('Open it in your browser and click "Open PayWay Checkout".');
