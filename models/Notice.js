import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    Topic: {
        type: String,
        required: [true, "Topic is required."],
        trim: true
    },
    Notice: {
        type: String,
        required: [true, "Notice content is required."],
    },
    Tag: {
        type: String,
        required: [true, "A tag is required."],
        enum: ['New', 'Urgent', 'Important', 'Academic'] // Only these values are allowed
    },
    Link: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true // This automatically adds `createdAt` and `updatedAt` fields
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;