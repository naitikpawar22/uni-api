import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/noticeRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Add your live frontend URL to this list
const allowedOrigins = [
    'https://unisphere.tech', 
    'http://localhost:3000',
    'https://uni-api-zeta.vercel.app'
   
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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







