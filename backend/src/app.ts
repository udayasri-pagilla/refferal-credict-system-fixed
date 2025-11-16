import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import purchaseRoutes from './routes/purchase';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || '';
mongoose.connect(MONGO).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

app.use('/api/auth', authRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (_, res) => res.send({ ok: true }));

export default app;
