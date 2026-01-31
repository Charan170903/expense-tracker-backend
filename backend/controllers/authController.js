const User = require('../models/User');
const { sendEmail, validateEmailConfig } = require('../utils/sendEmail');
const crypto = require('crypto');
const { validatePasswordStrength } = require('../utils/passwordValidator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Password does not meet requirements',
                errors: passwordValidation.errors
            });
        }

        // Create user
        const user = await User.create({
            email,
            password
        });

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        console.error('❌ Register Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Get Me Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user'
        });
    }
};

// @desc    Forgot password - send reset code
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    // 1. Controller Start
    console.log('[FORGOT_PASSWORD] CONTROLLER_START | Request received');
    const { email } = req.body;

    // 2. Validate Input
    if (!email) {
        console.log('[FORGOT_PASSWORD] VALIDATION_ERROR | No email provided');
        return res.status(400).json({
            success: false,
            error: "VALIDATION_ERROR",
            message: 'Please provide an email address'
        });
    }

    // 3. Email Config Validation (Fail Fast)
    const configCheck = validateEmailConfig();
    if (!configCheck.valid) {
        console.error(`[FORGOT_PASSWORD] CONFIG_MISSING | Missing: ${configCheck.missing.join(', ')}`);
        return res.status(500).json({
            success: false,
            error: "EMAIL_CONFIG_MISSING",
            message: 'Server email configuration is invalid'
        });
    }

    try {
        // 4. User Lookup
        const maskedEmail = email.replace(/(^.{2}).*(@.*$)/, '$1*****$2');
        console.log(`[FORGOT_PASSWORD] EMAIL_RECEIVED | Processing for: ${maskedEmail}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log('[FORGOT_PASSWORD] USER_NOT_FOUND | No account with this email');
            return res.status(404).json({
                success: false,
                error: "USER_NOT_FOUND",
                message: 'No account found with this email'
            });
        }
        console.log('[FORGOT_PASSWORD] USER_FOUND | User exists, proceeding to OTP generation');

        // 5. OTP Generation & Save
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();
        console.log('[FORGOT_PASSWORD] OTP_GENERATED | OTP saved to DB');

        // 6. Prepare Email Content
        const htmlMessage = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
                    <p>You requested to reset your password for your <strong>CHECK Expense Tracker</strong> account.</p>
                    <div style="background: #f4f6f7; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">${resetCode}</span>
                    </div>
                    <p style="text-align: center; color: #7f8c8d; font-size: 14px;">This code expires in 10 minutes.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #95a5a6;">If you didn't request a password reset, please ignore this email.</p>
                </div>
            </body>
            </html>
        `;

        const plainTextMessage = `Your password reset code is: ${resetCode}. It expires in 10 minutes.`;

        // 7. Attempt Email Send (Resend API)
        console.log('[FORGOT_PASSWORD] EMAIL_SEND_START | Attempting to send email via Resend');
        const sendResult = await sendEmail({
            email: user.email,
            subject: '🔐 Password Reset Code - CHECK',
            message: plainTextMessage,
            html: htmlMessage
        });

        if (sendResult.success) {
            console.log(`[FORGOT_PASSWORD] EMAIL_SEND_SUCCESS | Resend ID: ${sendResult.messageId}`);
            console.log('[FORGOT_PASSWORD] RESPONSE_SENT | 200 OK');
            return res.status(200).json({
                success: true,
                message: 'Reset code sent to your email'
            });
        } else {
            console.error(`[FORGOT_PASSWORD] EMAIL_SEND_FAILED | Code: ${sendResult.error.code}, Msg: ${sendResult.error.message}`);

            // ROLLBACK: Clear OTP from DB
            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            console.log('[FORGOT_PASSWORD] ROLLBACK | OTP cleared from DB');

            console.log('[FORGOT_PASSWORD] RESPONSE_SENT | 503 Service Unavailable');
            return res.status(503).json({
                success: false,
                error: "EMAIL_DELIVERY_FAILED",
                message: "Unable to send email at the moment"
            });
        }

    } catch (error) {
        console.error('[FORGOT_PASSWORD] SYSTEM_ERROR | ', error);
        res.status(500).json({
            success: false,
            error: "INTERNAL_SERVER_ERROR",
            message: 'Internal server error processing request'
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, code and new password'
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset code'
            });
        }

        // Validate password strength
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Password does not meet requirements',
                errors: passwordValidation.errors
            });
        }

        // Check if new password is the same as the old one
        const isSamePassword = await user.comparePassword(password);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'New password cannot be the same as the old password'
            });
        }

        // Set new password
        user.password = password;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('❌ Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword
};
