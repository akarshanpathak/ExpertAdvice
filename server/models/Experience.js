const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true }, // e.g., "SDE Intern"
    stages: [{
        stageType: {
            type: String,
            enum: ['Online Test', 'Technical', 'HR'],
            required: true
        },
        description: { type: String, required: true },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        },
        result: {
            type: String,
            enum: ['Selected', 'Rejected', 'Pending'],
            default: 'Pending'
        }
    }],
    overallResult: {
        type: String,
        enum: ['Selected', 'Rejected', 'Pending'],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
