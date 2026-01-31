/**
 * Password Strength Validator
 * Enforces medium to strong password requirements
 */

const validatePasswordStrength = (password) => {
    const errors = [];

    // Minimum length
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    // Uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Number
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Special character (recommended for strong)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Calculate strength
    let strength = 'weak';
    if (errors.length === 0) {
        strength = hasSpecialChar ? 'strong' : 'medium';
    }

    return {
        isValid: errors.length === 0,
        strength,
        errors,
        hasSpecialChar
    };
};

module.exports = { validatePasswordStrength };
