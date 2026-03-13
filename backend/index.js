import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import brandRoutes from './routes/brandRoutes.route.js';
import categoryRoutes from './routes/categoryRoutes.route.js';

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.json({ message: 'Api is running...' });
});
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`✅ Backend running on http://localhost:${PORT}`),
);
