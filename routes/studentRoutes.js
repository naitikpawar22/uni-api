// File: routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust path if needed
const bcrypt = require('bcryptjs');

// --- REGISTER a new Student (POST /api/students/register) ---
router.post('/register', async (req, res) => {
    const { mobileNumber, password, year, department, division } = req.body;

    try {
        // Check if student already exists
        const existingStudent = await Student.findOne({ mobileNumber });
        if (existingStudent) {
            return res.status(409).json({ message: 'A student with this mobile number already exists.' });
        }

        const newStudent = new Student({
            mobileNumber,
            password,
            year,
            // Only set department if it's not First Year. The model handles validation.
            department: year === 'First Year' ? null : department,
            division,
        });

        // The pre-save hook in the model will hash the password
        const savedStudent = await newStudent.save();

        // Don't send the password back in the response
        const studentResponse = { ...savedStudent._doc };
        delete studentResponse.password;

        res.status(201).json({ message: 'Student registered successfully!', student: studentResponse });

    } catch (error) {
        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation failed', errors: error.errors });
        }
        res.status(500).json({ message: 'Error registering student', error: error.message });
    }
});


// --- LOGIN a Student (POST /api/students/login) ---
router.post('/login', async (req, res) => {
    const { mobileNumber, password, year, department, division } = req.body;

    // --- Basic Validation ---
    if (!mobileNumber || !password || !year || !division) {
        return res.status(400).json({ message: 'Missing required login fields.' });
    }
    
    try {
        // --- Build the Search Query Conditionally ---
        let searchQuery = {
            mobileNumber,
            year,
            division: division.toUpperCase()
        };

        // If the student is NOT in First Year, add the department to the search
        if (year !== 'First Year') {
            if (!department) {
                return res.status(400).json({ message: 'Department is required to log in for this year.' });
            }
            searchQuery.department = department;
        } else {
            // For First Year, ensure we search for students with no department
            searchQuery.department = null;
        }

        // --- Find the Student ---
        const student = await Student.findOne(searchQuery);
        
        // If no student matches the criteria (year, div, dept)
        if (!student) {
            return res.status(404).json({ message: 'Login failed. Invalid credentials or details.' });
        }

        // --- Compare the provided password with the stored hashed password ---
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Login failed. Invalid password.' });
        }

        // --- Login Successful ---
        // (Optional but recommended: Generate a JWT token here for secure sessions)
        res.status(200).json({ message: 'Login successful!', studentId: student._id });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

module.exports = router;

