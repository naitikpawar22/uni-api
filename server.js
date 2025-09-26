// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();
const app = express();

// --- CORS ---
const allowedOrigins = [
  'https://unisphere.tech',
  'http://localhost:3000',
  'https://uni-api-woad.vercel.app' // replace with your actual frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server or same-origin calls (no origin header)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// --- MongoDB (serverless-friendly) ---
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('FATAL ERROR: MONGO_URI is not defined.');
  }
  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log('✅ MongoDB database connected successfully.');
}

// --- Routes ---
app.use('/api/notices', noticeRoutes);

// --- Root ---
app.get('/', (req, res) => {
  res.send('Unisphere Notice API is active.');
});

export { app }; // export app for serverless handler
