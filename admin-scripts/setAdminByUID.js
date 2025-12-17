const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// Get the UID from Firebase Console → Authentication
const uid = 'pYRcE4hZJOesmVAbrF2KgQyUqjo1';

console.log(`Setting admin claim for UID: ${uid}`);

admin
	.auth()
	.getUser(uid)
	.then((user) => {
		console.log('✓ Found user:', user.email);
		console.log(
			'  Provider:',
			user.providerData.map((p) => p.providerId).join(', ')
		);
		return admin.auth().setCustomUserClaims(uid, { admin: true });
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
