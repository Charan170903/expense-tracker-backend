# Forgot Password Endpoint Test

## Test Cases:

### 1. Test with valid registered email
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "your_registered_email@example.com"
}

### Expected Response (Success):
- Status: 200
- Response: { "success": true, "message": "Reset code sent to email" }
- Check your email for the reset code

### Expected Response (Email Failure - Development Mode):
- Status: 200
- Response: { 
    "success": true, 
    "message": "Reset code generated (Check server console since email sending failed)",
    "developmentCode": "123456"
  }
- Check backend terminal for the reset code

### 2. Test with unregistered email
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "nonexistent@example.com"
}

### Expected Response:
- Status: 404
- Response: { "success": false, "message": "No user found with that email" }

### 3. Test without email
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{}

### Expected Response:
- Status: 400
- Response: { "success": false, "message": "Please provide an email address" }

## Troubleshooting:

### If you still get 500 errors:
1. Check the backend terminal for detailed error logs
2. Verify your Gmail App Password is valid
3. Ensure 2-Factor Authentication is enabled on your Google account
4. Generate a new App Password if needed: https://myaccount.google.com/apppasswords

### Common Gmail SMTP Issues:
- **Invalid credentials**: Regenerate App Password
- **Less secure app access**: Use App Passwords instead
- **Connection timeout**: Check firewall settings
- **SSL/TLS errors**: Already configured in the updated code

## Reset Password Flow:

After getting the reset code:

POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "your_email@example.com",
  "code": "123456",
  "password": "your_new_password"
}

### Expected Response:
- Status: 200
- Response: { "success": true, "message": "Password reset successful" }
