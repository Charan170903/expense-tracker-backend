const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// --- Rate Limiters ---

// Login Limiter: 5 attempts per 15 mins
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Forgot Password Limiter: 3 requests per 30 mins
const forgotPasswordLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many password reset requests, please try again after 30 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Reset Password Limiter: 5 attempts per 15 mins
const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- Routes ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', loginLimiter, login);

// @route   GET /api/auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', authenticate, getMe);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', resetPasswordLimiter, resetPassword);

module.exports = router;
