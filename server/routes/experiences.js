const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const Company = require('../models/Company');
const auth = require('../middleware/authMiddleware');

// Get all experiences or filter by company
router.get('/', async (req, res) => {
    try {
        const { companyId } = req.query;
        let query = {};
        if (companyId) query.company = companyId;

        const experiences = await Experience.find(query)
            .populate('company', 'name')
            .populate('user', 'name role') // Populate user details if needed
            .sort({ createdAt: -1 });

        res.json(experiences);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new experience (Multi-Stage)
router.post('/', auth, async (req, res) => {
    const { companyId, role, stages, overallResult } = req.body;

    try {
        // Verify company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const newExperience = new Experience({
            company: companyId,
            user: req.user.id,
            role,
            stages,
            overallResult
        });

        const savedExperience = await newExperience.save();
        res.status(201).json(savedExperience);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an experience
router.delete('/:id', auth, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: 'Experience not found' });

        // Check if user owns the experience or is admin
        if (experience.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await experience.deleteOne();
        res.json({ message: 'Experience removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
