const nodemailer = require('nodemailer');

// Helper to create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false, // Helps with self-signed certs in Render
            ciphers: 'SSLv3'
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

const validateSmtpConfig = () => {
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_EMAIL', 'SMTP_PASSWORD'];
    const missingVars = requiredVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
        return {
            valid: false,
            missing: missingVars
        };
    }
    return { valid: true };
};

const verifySmtpConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message
            }
        };
    }
};

const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const message = {
            from: `${process.env.FROM_NAME || 'Expense Tracker'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(message);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        return {
            success: false,
            error: {
                code: error.code,
                message: error.message,
                command: error.command
            }
        };
    }
};

module.exports = {
    sendEmail,
    verifySmtpConnection,
    validateSmtpConfig
};
