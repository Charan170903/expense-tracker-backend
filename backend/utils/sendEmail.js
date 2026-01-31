const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Validate required environment variables
        if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
            console.error('❌ SMTP configuration missing in environment variables');
            throw new Error('Email service is not configured');
        }

        // Create a transporter with Gmail-specific configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            // Gmail-specific options
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
                ciphers: 'SSLv3'
            },
            // Timeout settings
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('✅ SMTP server is ready to send emails');

        // Define email options
        const message = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || undefined, // HTML version (optional)
        };

        // Send email
        const info = await transporter.sendMail(message);

        console.log('✅ Email sent successfully to:', options.email);
        console.log('✅ Message ID:', info.messageId);

        return info;
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        console.error('❌ Full error:', error);

        // Re-throw the error so the calling function can handle it
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = sendEmail;
