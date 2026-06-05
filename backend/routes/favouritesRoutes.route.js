import express from 'express';
import {
	getFavourites,
	addFavourites,
	removeFavourites,
} from '../controllers/favourites.controller.js';
import verifyFirebaseToken from '../middleware/firebaseAuth.middleware.js';

const router = express.Router();

//Get all favourites
router.get('/', verifyFirebaseToken, getFavourites);

//Add favourites
router.post('/:productId', verifyFirebaseToken, addFavourites);

//Remove favourites
router.delete('/:productId', verifyFirebaseToken, removeFavourites);

export default router;
