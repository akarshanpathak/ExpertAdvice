const express = require('express');
const Company = require('../models/Company');
const Experience = require('../models/Experience');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Create Company (Admin Only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, industry } = req.body;
        let company = await Company.findOne({ name });
        if (company) return res.status(400).json({ message: 'Company already exists' });

        company = new Company({ name, industry });
        await company.save();
        res.json(company);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all companies (with search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }
        const companies = await Company.find(query);
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get company by ID with experiences
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const experiences = await Experience.find({ company: req.params.id }).populate('company', 'name');

        // We don't populate user info for privacy/anonymity
        res.json({ company, experiences });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
