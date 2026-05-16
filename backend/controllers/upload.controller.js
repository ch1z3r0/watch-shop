import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getR2 } from '../utils/r2.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowedTypes.includes(req.file.mimetype)) {
			return res
				.status(400)
				.json({ message: 'Only JPEG, PNG, WebP, and GIF images are allowed' });
		}

		const ext = path.extname(req.file.originalname).toLowerCase();
		const key = `assets/watches/variants/${uuidv4()}${ext}`;

		await getR2().send(
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: key,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			}),
		);

		const url = `${process.env.R2_PUBLIC_URL}/${key}`;
		res.status(200).json({ url });
	} catch (error) {
		res.status(500).json({ message: 'Upload failed', error: error.message });
	}
};

export const deleteImage = async (req, res) => {
	try {
		const { key } = req.body;
		if (!key) {
			return res.status(400).json({ message: 'Image key is required' });
		}

		await getR2().send(
			new DeleteObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: key,
			}),
		);

		res.status(200).json({ message: 'Image deleted' });
	} catch (error) {
		res.status(500).json({ message: 'Delete failed', error: error.message });
	}
};
