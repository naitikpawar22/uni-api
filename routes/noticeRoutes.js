// File: routes/noticeRoutes.js

const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice'); // Make sure the path to your model is correct

// --- READ ALL Notices (GET /api/notices) ---
router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 }); // Get newest first
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices', error: error.message });
    }
});

// --- CREATE a new Notice (POST /api/notices) ---
router.post('/', async (req, res) => {
    const { title, message, tag, link } = req.body;

    // Basic validation
    if (!title || !message) {
        return res.status(400).json({ message: 'Title and message fields are required.' });
    }

    const newNotice = new Notice({
        title,
        message,
        tag: tag || 'New', // Default tag if not provided
        link
    });

    try {
        const savedNotice = await newNotice.save();
        res.status(201).json(savedNotice); // 201 means "Created"
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice', error: error.message });
    }
});

// --- UPDATE an existing Notice (PATCH /api/notices/:id) ---
router.patch('/:id', async (req, res) => {
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,  // The ID of the notice to update
            req.body,       // The data to update with
            { new: true, runValidators: true } // Options: return the updated doc and run schema validators
        );

        if (!updatedNotice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.status(200).json(updatedNotice);
    } catch (error) {
        res.status(500).json({ message: 'Error updating notice', error: error.message });
    }
});

// --- DELETE a Notice (DELETE /api/notices/:id) ---
router.delete('/:id', async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

        if (!deletedNotice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        res.status(200).json({ message: 'Notice deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting notice', error: error.message });
    }
});


module.exports = router;
