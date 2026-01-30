const express = require('express');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/', (req, res) => {
    const healthData = {
        status: 'OK',
        message: 'Server is running smoothly',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: req.app.locals.mongoStatus || 'unknown'
    };

    res.status(200).json(healthData);
});

module.exports = router;
