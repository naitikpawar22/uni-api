// File: netlify/functions/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// We need to change the path to the routes and models
const noticeRoutes = require('../../routes/noticeRoutes.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// API Routes
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'API is active' }));
router.use('/notices', noticeRoutes);

app.use('/api', router);

// Export the handler for Netlify
module.exports.handler = serverless(app);
