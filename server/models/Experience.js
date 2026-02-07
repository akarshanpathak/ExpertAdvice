const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Private
    roundType: {
        type: String,
        enum: ['OT', 'Technical', 'HR'],
        required: true
    },
    description: { type: String, required: true },
    result: {
        type: String,
        enum: ['Qualified', 'Not Qualified'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
