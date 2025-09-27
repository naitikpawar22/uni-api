const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true, // No two students can have the same mobile number
        trim: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit mobile number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    year: {
        type: String,
        required: true,
        enum: ['First Year', 'Second Year', 'Third Year', 'Last Year'] // Only these values are allowed
    },
    department: {
        type: String,
        // Department is not required for 'First Year'
        // We use a custom validator to enforce this rule
        validate: {
            validator: function(v) {
                // If year is not 'First Year', department must not be null or empty
                if (this.year !== 'First Year') {
                    return v != null && v.trim() !== '';
                }
                // If year is 'First Year', department is allowed to be null
                return true;
            },
            message: 'Department is required for Second, Third, and Last Year students.'
        },
        enum: {
            values: [null, 'Computer', 'AIML', 'E&TC', 'Civil', 'AIDS', 'Electrical', 'Mechanical'],
            message: '{VALUE} is not a valid department.'
        }
    },
    division: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        match: [/^[A-Z]$/, 'Division must be a single letter from A-Z']
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Pre-save hook to hash password before saving
studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
