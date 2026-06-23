import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import brandRoutes from './routes/brandRoutes.route.js';
import categoryRoutes from './routes/categoryRoutes.route.js';
import productRoutes from './routes/productRoutes.route.js';
import uploadRoutes from './routes/uploadRoutes.route.js';
import authRoutes from './routes/authRoutes.route.js';
import orderRoutes from './routes/orderRoutes.route.js';
import favouritesRoutes from './routes/favouritesRoutes.route.js';
import paymentRoutes from './routes/paymentRoutes.route.js';

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
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/favourites', favouritesRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`✅ Backend running on http://localhost:${PORT}`),
);
