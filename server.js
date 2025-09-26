// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();
const app = express();

// Middleware
const corsOptions = {
  origin: 'https://unisphere.tech'
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection (serverless-friendly)
let isConnected = false; // track connection globally

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// API Routes
app.use('/api/notices', noticeRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Unisphere Notice API is active and running.');
});

export { app, connectDB }; // export app and connectDB
