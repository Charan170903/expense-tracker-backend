const express = require('express');
const router = express.Router();
const {
    getMonthlySummary,
    detectSubscriptions,
    getYearOverview
} = require('../controllers/insightController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// @route   GET /api/insights/monthly-summary
// @desc    Get monthly financial summary
// @access  Private
// @query   year (optional), month (optional)
router.get('/monthly-summary', getMonthlySummary);

// @route   GET /api/insights/subscriptions
// @desc    Detect recurring/subscription transactions
// @access  Private
// @query   minOccurrences (default: 2), toleranceDays (default: 3)
router.get('/subscriptions', detectSubscriptions);

// @route   GET /api/insights/year-overview
// @desc    Get yearly financial overview with monthly breakdown
// @access  Private
// @query   year (optional)
router.get('/year-overview', getYearOverview);

module.exports = router;
