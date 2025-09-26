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
        enum: ['New', 'Urgent', 'Important', 'Academic']
    },
    Link: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true 
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
