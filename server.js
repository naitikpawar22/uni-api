import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Production CORS: Add your new Vercel URL to this list
const allowedOrigins = [
    'https://unisphere.tech', 
    'http://localhost:3000',
    'https://uni-api-fawn.vercel.app' // <-- ADD THIS LINE
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB database connected successfully."))
    .catch(err => console.error("❌ MongoDB connection error:", err));

app.use('/api/notices', noticeRoutes);

app.get('/', (req, res) => {
    res.send('Unisphere Notice API is active.');
});

app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port: ${PORT}`);
});
