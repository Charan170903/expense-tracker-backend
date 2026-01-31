const { Resend } = require('resend');

// Validate Environment Configuration
const validateEmailConfig = () => {
    const requiredVars = ['RESEND_API_KEY', 'EMAIL_FROM'];
    const missingVars = requiredVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
        return {
            valid: false,
            missing: missingVars
        };
    }
    return { valid: true };
};

const sendEmail = async (options) => {
    // Fail fast if config is missing (safety check)
    const configCheck = validateEmailConfig();
    if (!configCheck.valid) {
        console.error(`[RESEND_ERROR] Configuration missing: ${configCheck.missing.join(', ')}`);
        return {
            success: false,
            error: {
                message: 'Server email configuration is missing',
                code: 'CONFIG_MISSING'
            }
        };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.EMAIL_FROM;

        console.log(`[RESEND] Attempting to send email to: ${options.email}`);

        const data = await resend.emails.send({
            from: fromEmail,
            to: options.email,
            subject: options.subject,
            html: options.html,
            text: options.message, // Plain text fallback
        });

        if (data.error) {
            console.error('[RESEND_API_ERROR]', data.error);
            return {
                success: false,
                error: {
                    message: data.error.message,
                    code: data.error.name || 'RESEND_API_ERROR'
                }
            };
        }

        console.log(`[RESEND] Email sent successfully. ID: ${data.data.id}`);
        return { success: true, messageId: data.data.id };

    } catch (error) {
        console.error('[RESEND_SYSTEM_ERROR]', error);
        return {
            success: false,
            error: {
                message: error.message,
                code: 'SYSTEM_ERROR'
            }
        };
    }
};

module.exports = {
    sendEmail,
    validateEmailConfig
};
