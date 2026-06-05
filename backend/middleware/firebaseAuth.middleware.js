import admin from '../config/firebase.js';

const verifyFirebaseToken = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided.' });
	}

	const token = authHeader.split('Bearer ')[1];

	try {
		const decodedToken = await admin.auth().verifyIdToken(token);
		req.user = decodedToken;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token.' });
	}
};

export default verifyFirebaseToken;
