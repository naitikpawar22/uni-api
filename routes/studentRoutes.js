// File: routes/studentRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const Student = require('../models/Student.js');
const router = express.Router();

// POST /api/students/login
router.post('/login', async (req, res) => {
    try {
        const { mobile, password, year, department, division } = req.body;

        if (!mobile || !password || !year || !division)
            return res.status(400).json({ message: "Missing required fields" });

        // Build query dynamically
        let query = { mobile, year, division };
        if (year !== "1") query.department = department; // only check department for 2nd+ years

        const student = await Student.findOne(query);
        if (!student) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
