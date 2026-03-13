import express from 'express';
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
} from '../controllers/category.controller.js';

const router = express.Router();

//Get all categories
router.get('/', getAllCategories);

//Get category by id
router.get('/:categoryId', getCategoryById);

//Create category
router.post('/', createCategory);

//Update category
router.put('/:categoryId', updateCategory);

//Delete category
router.delete('/:categoryId', deleteCategory);

export default router;
