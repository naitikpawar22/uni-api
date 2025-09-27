// File: netlify/functions/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const path = require('path'); // Added for robust pathing

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// --- IMPORT YOUR ROUTES ---
// We need to change the path to the routes and models
const noticeRoutes = require('../../routes/noticeRoutes.js');
const studentRoutes = require('../../routes/studentRoutes.js'); // <-- ADDED: Import student routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined. Make sure it is in your .env file and Netlify environment variables.');
}
mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// API Routes
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'API is active' }));

// Use your routes with a base path
router.use('/notices', noticeRoutes);
router.use('/students', studentRoutes); // <-- ADDED: Use the student routes

app.use('/api', router);

// Export the handler for Netlify
module.exports.handler = serverless(app);

