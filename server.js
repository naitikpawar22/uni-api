import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

// --- Setup ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors()); // Allows requests from other origins (like your React app)
app.use(express.json()); // Allows the server to understand JSON data

// --- Database Connection ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB database connected successfully."))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// --- API Routes ---
app.use('/api/notices', noticeRoutes);

// --- Root Route ---
app.get('/', (req, res) => {
    res.send('Unisphere Notice API is active and running.');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port: ${PORT}`);
});