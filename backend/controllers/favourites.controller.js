import User from '../models/User.js';

// --- Helper -------------------------------------------------------------
export const findOrCreateUser = async ({ firebaseUid, email }) => {
	let user = await User.findOne({ firebaseUid });
	if (!user) {
		user = await User.create({ firebaseUid, ...(email && { email }) });
	}
	return user;
};

// --- Get Favourites -----------------------------------------------------
export const getFavourites = async (req, res) => {
	try {
		const user = await findOrCreateUser({
			firebaseUid: req.user.uid,
			email: req.user.email || req.user.name || '',
		});
		await user.populate('favourites');
		return res.status(200).json(user.favourites);
	} catch (error) {
		res.status(500).json({ message: 'Failed to get favourites', error });
	}
};

// --- Add Favourites ----------------------------------------------------
export const addFavourites = async (req, res) => {
	try {
		const user = await findOrCreateUser({
			firebaseUid: req.user.uid,
			email: req.user.email || req.user.name || '',
		});
		const { productId } = req.params;
		if (user.favourites.includes(productId)) {
			return res.status(400).json({ message: 'Already in favourites.' });
		}
		user.favourites.push(productId);
		await user.save();
		await user.populate('favourites');
		res.status(200).json(user.favourites);
	} catch (error) {
		res.status(500).json({ message: 'Failed to add favourite', error });
	}
};

// --- Remove Favourites -------------------------------------------------
export const removeFavourites = async (req, res) => {
	try {
		const user = await findOrCreateUser({
			firebaseUid: req.user.uid,
			email: req.user.email || req.user.name || '',
		});
		const { productId } = req.params;
		user.favourites = user.favourites.filter(
			(id) => id.toString() !== productId,
		);

		await user.save();
		await user.populate('favourites');
		res.status(200).json(user.favourites);
	} catch (error) {
		res.status(500).json({ message: 'Failed to remove favourite', error });
	}
};
