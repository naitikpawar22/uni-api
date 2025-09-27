// File: models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    year: { type: String, required: true },
    department: { type: String }, // optional for 1st year
    division: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
