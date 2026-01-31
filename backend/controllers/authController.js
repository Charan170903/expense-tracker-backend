const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
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
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email'
            });
        }

        // Generate a 6-digit random code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Set reset code and expiration (10 minutes)
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Professional HTML email template
        const htmlMessage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid #e5e5e5;">
                            <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 0.1em; color: #1a1a1a;">
                                <span style="color: #6b8e7f;">C</span>HEC<span style="color: #6b8e7f;">K</span>
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1a1a1a;">
                                Password Reset Request
                            </h2>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #666666;">
                                We received a request to reset your password. Use the verification code below to create a new password:
                            </p>
                            
                            <!-- Code Box -->
                            <table role="presentation" style="width: 100%; margin: 32px 0;">
                                <tr>
                                    <td align="center" style="background-color: #f8f8f8; padding: 24px; border-radius: 8px; border: 2px dashed #6b8e7f;">
                                        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; font-family: 'Courier New', monospace;">
                                            ${resetCode}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #666666;">
                                <strong style="color: #1a1a1a;">⏱ This code expires in 10 minutes.</strong>
                            </p>
                            
                            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5; color: #666666;">
                                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <!-- Divider -->
                            <div style="border-top: 1px solid #e5e5e5; margin: 32px 0;"></div>
                            
                            <!-- Security Notice -->
                            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #999999;">
                                <strong style="color: #666666;">🔒 Security Tip:</strong> Never share this code with anyone. CHECK will never ask for your verification code via email, phone, or text message.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #f8f8f8; border-radius: 0 0 12px 12px; text-align: center;">
                            <p style="margin: 0 0 8px; font-size: 12px; color: #999999;">
                                This email was sent from CHECK Expense Tracker
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} CHECK. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `.trim();

        // Plain text fallback
        const plainTextMessage = `
Password Reset Request

We received a request to reset your password for your CHECK account.

Your verification code is: ${resetCode}

This code will expire in 10 minutes.

If you didn't request a password reset, you can safely ignore this email.

Security Tip: Never share this code with anyone. CHECK will never ask for your verification code via email, phone, or text message.

---
This email was sent from CHECK Expense Tracker
© ${new Date().getFullYear()} CHECK. All rights reserved.
        `.trim();

        try {
            await sendEmail({
                email: user.email,
                subject: '🔐 Password Reset Code - CHECK',
                message: plainTextMessage,
                html: htmlMessage
            });

            res.status(200).json({
                success: true,
                message: 'Reset code sent to email'
            });
        } catch (emailError) {
            console.error('❌ Email could not be sent. Reset code:', resetCode);

            // For development, if email fails, we might still want to proceed or at least log the code
            if (process.env.NODE_ENV === 'development') {
                return res.status(200).json({
                    success: true,
                    message: 'Reset code generated (Check server console since email sending failed)',
                    developmentCode: resetCode // ONLY FOR DEV
                });
            }

            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        console.error('❌ Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during forgot password'
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
