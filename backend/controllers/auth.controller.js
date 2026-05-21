import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
	console.log('HASH FROM ENV:', process.env.ADMIN_PASSWORD_HASH); //
	console.log('REQ BODY:', req.body);
	const { email, password } = req.body;

	//Check Email
	if (email !== process.env.ADMIN_EMAIL) {
		return res.status(401).json({ message: 'Invalid Credentials.' });
	}

	//Check Password
	const isMatch = await bcrypt.compare(
		password,
		process.env.ADMIN_PASSWORD_HASH,
	);
	if (!isMatch) {
		return res.status(401).json({ message: 'Invalid Credentials.' });
	}

	// Create a token that expires in 7 days
	const token = jwt.sign({ email }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});

	res.status(201).json({ token });
};
