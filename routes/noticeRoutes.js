const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice.js');

router.get('/', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notices", error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newNotice = new Notice(req.body);
        const savedNotice = await newNotice.save();
        res.status(201).json({ message: 'Notice created successfully!', notice: savedNotice });
    } catch (error) {
        res.status(400).json({ message: "Failed to create notice", error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedNotice) return res.status(440).json({ message: "Notice not found." });
        res.status(200).json({ message: 'Notice updated successfully!', notice: updatedNotice });
    } catch (error) {
        res.status(400).json({ message: "Failed to update notice", error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(req.params.id);
        if (!deletedNotice) return res.status(404).json({ message: "Notice not found." });
        res.status(200).json({ message: 'Notice deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete notice", error: error.message });
    }
});

module.exports = router;
