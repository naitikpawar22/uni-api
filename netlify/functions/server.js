const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const serverless = require('serverless-http');
const noticeRoutes = require('./routes/noticeRoutes.js');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.log("✅ MongoDB database connected successfully."))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Unisphere API is active.' }));
router.use('/notices', noticeRoutes);

app.use('/api', router);

module.exports.handler = serverless(app);
