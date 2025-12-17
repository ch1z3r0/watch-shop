// setAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const email = 'chulchivorn@gmail.com'; // Replace with your email
console.log(`Setting admin claim for Email: ${email}`);

admin
	.auth()
	.getUserByEmail(email)
	.then((user) => {
		console.log('✓ Found user:', user.email);
		console.log(
			'  Provider:',
			user.providerData.map((p) => p.providerId).join(', ')
		);
		return admin.auth().setCustomUserClaims(user.uid, { admin: true });
	})
	.then(() => {
		console.log('✅ SUCCESS! Admin claim has been set.');
		console.log('⚠️  Log out and log back in to see changes.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('❌ ERROR:', error.message);
		process.exit(1);
	});
