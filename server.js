import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

// --- Setup ---
dotenv.config();
const app = express();
// Hosting services provide their own port, so we use `process.env.PORT`
const PORT = process.env.PORT || 5000;

// --- Middleware ---

// Production CORS configuration: Only allow requests from your frontend domain
const corsOptions = {
  origin: 'https://unisphere.tech'
};
app.use(cors(corsOptions));

app.use(express.json());

// --- Database Connection ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
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
