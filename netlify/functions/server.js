// File: netlify/functions/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const path = require('path'); // for robust path resolution

// Load environment variables from the project root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// --- IMPORT ROUTES ---
const noticeRoutes = require('../../routes/noticeRoutes.js');
const studentRoutes = require('../../routes/studentRoutes.js'); // login API

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // for parsing JSON requests

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined. Make sure it is in your .env file or Netlify environment variables.');
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// --- API ROUTES ---
const router = express.Router();

// Test route
router.get('/', (req, res) => res.json({ message: 'API is active' }));

// Notices API
router.use('/notices', noticeRoutes);

// Student login API
router.use('/students', studentRoutes);

// Attach router to /api
app.use('/api', router);

// --- EXPORT HANDLER FOR NETLIFY ---
module.exports.handler = serverless(app);




