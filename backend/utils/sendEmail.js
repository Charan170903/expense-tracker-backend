const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Validate Environment Variables
    const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_EMAIL', 'SMTP_PASSWORD'];
    const missingVars = requiredVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
        console.error(`❌ CRITICAL: Missing email configuration: ${missingVars.join(', ')}`);
        // We throw here because this is a server configuration error, not a runtime email failure
        throw new Error('Email server configuration is missing');
    }

    try {
        // 2. Create Transporter with Gmail Optimization
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            // Gmail & Production specific settings
            tls: {
                rejectUnauthorized: false, // Helps with self-signed certs in some container environments
                ciphers: 'SSLv3'
            },
            // Timeouts to prevent hanging requests
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });

        // 3. Define Email Options
        const message = {
            from: `${process.env.FROM_NAME || 'Expense Tracker'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        // 4. Send Email
        console.log(`📧 Attempting to send email to: ${options.email}`);
        const info = await transporter.sendMail(message);

        console.log(`✅ Email sent successfully. Message ID: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error('❌ SEND_EMAIL_FAILURE:');
        console.error(`   - Reason: ${error.message}`);
        console.error(`   - Code: ${error.code}`);
        console.error(`   - Command: ${error.command}`);

        // Do NOT throw. Return false so controller can handle "success but no email" scenario.
        return false;
    }
};

module.exports = sendEmail;
