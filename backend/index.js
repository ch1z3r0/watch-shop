const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('✅ MongoDB connected'))
	.catch((e) => console.error('❌ Mongo error:', e.message));

app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from backend 👋' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`✅ Backend running on http://localhost:${PORT}`),
);
