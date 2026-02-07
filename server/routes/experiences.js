const express = require('express');
const Experience = require('../models/Experience');
const Company = require('../models/Company');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add Experience (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { companyId, roundType, description, result } = req.body;

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const experience = new Experience({
            company: company._id,
            user: req.user.id,
            roundType,
            description,
            result
        });

        await experience.save();
        res.json(experience);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete Experience (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) return res.status(404).json({ message: 'Experience not found' });

        // Check ownership
        if (experience.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await experience.deleteOne();
        res.json({ message: 'Experience removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
