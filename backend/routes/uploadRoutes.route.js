import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Store file in memory (buffer) — no temp files on disk
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post('/', upload.single('image'), uploadImage);
router.delete('/', deleteImage);

export default router;
