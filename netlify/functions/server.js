const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// We need to change the path to the routes and models
const noticeRoutes = require('../../routes/noticeRoutes.js');
const Student = require('../../models/Student.js'); // Import Student model

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

// -- CREDENTIAL ROUTES --
router.post('/auth/register', async (req, res) => {
    const { mobileNumber, password, year, department, division } = req.body;
    try {
        const studentExists = await Student.findOne({ mobileNumber });
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this mobile number already exists.' });
        }
        const student = new Student({ mobileNumber, password, year, department, division });
        await student.save();
        res.status(201).json({ message: "Student registered successfully!", studentId: student._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

router.post('/auth/login', async (req, res) => {
    const { mobileNumber, password } = req.body;
    try {
        const student = await Student.findOne({ mobileNumber });
        if (!student || !(await student.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid mobile number or password.' });
        }
        const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: "Login successful!",
            token,
            student: {
                id: student._id,
                mobileNumber: student.mobileNumber,
                year: student.year,
                department: student.department,
                division: student.division
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});


app.use('/api', router);

// Export the handler for Netlify
module.exports.handler = serverless(app);

