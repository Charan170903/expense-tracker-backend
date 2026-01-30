# 🔐 Authentication API Documentation

## Overview
JWT-based authentication system for the Expense Tracker API. All transaction endpoints require authentication.

---

## Authentication Flow

1. **Register** → Get JWT token
2. **Login** → Get JWT token
3. **Use token** in Authorization header for protected routes

---

## Endpoints

### 1. Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation:**
- Email: Required, valid format, unique
- Password: Required, minimum 6 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65b9c1234567890abcdef123",
    "email": "user@example.com",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Validation failed or user already exists
- 500: Server error

**Example (curl):**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Example (PowerShell):**
```powershell
$user = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -Body $user -ContentType "application/json"
```

---

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65b9c1234567890abcdef123",
    "email": "user@example.com",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

**Example (curl):**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Example (PowerShell):**
```powershell
$credentials = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -Body $credentials -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

---

### 3. Get Current User
**GET** `/api/auth/me`

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65b9c1234567890abcdef123",
    "email": "user@example.com",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

**Error Responses:**
- 401: Not authorized, missing or invalid token
- 404: User not found
- 500: Server error

**Example (curl):**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Example (PowerShell):**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers
```

---

## Using Authentication with Transactions

All transaction endpoints now require authentication. Include the JWT token in the Authorization header.

### Example: Create Transaction (Authenticated)

**PowerShell:**
```powershell
# 1. Login and get token
$credentials = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -Body $credentials -ContentType "application/json"
$token = $loginResponse.token

# 2. Create transaction with token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$transaction = @{
    title = "Grocery Shopping"
    amount = 1500
    category = "Groceries"
    type = "expense"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/transactions" -Headers $headers -Body $transaction
```

**curl:**
```bash
# 1. Login and extract token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Create transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":350,"category":"Food & Dining","type":"expense"}'
```

---

## Protected Endpoints

All these endpoints now require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions` | Get all user's transactions |
| GET | `/api/transactions/:id` | Get single transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

**Note:** Users can only access their own transactions. The API automatically filters by the authenticated user.

---

## Token Information

- **Format:** JWT (JSON Web Token)
- **Expiration:** 30 days (configurable in .env)
- **Header Format:** `Bearer <token>`
- **Payload Contains:**
  - User ID
  - Email
  - Expiration time

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized. Please login to access this resource"
}
```

### Token Expired
```json
{
  "success": false,
  "message": "Token expired. Please login again"
}
```

### Invalid Token
```json
{
  "success": false,
  "message": "Invalid token. Please login again"
}
```

---

## Security Features

✅ **Password Hashing** - bcrypt with salt rounds  
✅ **JWT Tokens** - Secure, stateless authentication  
✅ **User Isolation** - Users can only access their own data  
✅ **Token Expiration** - Automatic timeout after 30 days  
✅ **Protected Routes** - Middleware validates all requests  

---

## Complete Testing Workflow (PowerShell)

```powershell
# 1. Register new user
$newUser = @{
    email = "john@example.com"
    password = "secure123"
} | ConvertTo-Json

$regResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -Body $newUser -ContentType "application/json"
$token = $regResponse.token
Write-Host "✅ Registered! Token: $token"

# 2. Verify token works - get current user
$headers = @{ "Authorization" = "Bearer $token" }
$me = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers
Write-Host "✅ Current User:" $me.user.email

# 3. Create a transaction
$headers["Content-Type"] = "application/json"
$tx = @{
    title = "Monthly Salary"
    amount = 50000
    category = "Salary"
    type = "income"
} | ConvertTo-Json

$newTx = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/transactions" -Headers $headers -Body $tx
Write-Host "✅ Transaction Created:" $newTx.data.title

# 4. Get all transactions
$allTx = Invoke-RestMethod -Uri "http://localhost:5000/api/transactions" -Headers $headers
Write-Host "✅ Total Transactions:" $allTx.count
Write-Host "✅ Balance: ₹" $allTx.summary.balance

# 5. Logout simulation (delete token)
Remove-Variable token
Write-Host "✅ Logged out (token cleared)"
```

---

## Environment Variables

Add to `.env`:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=30d
```

**Production Note:** Change `JWT_SECRET` to a strong, random value!

---

## Password Requirements

- Minimum 6 characters
- No maximum length
- Case sensitive
- All characters allowed

---

## Email Requirements

- Valid email format
- Unique in database
- Case insensitive (stored as lowercase)
- Trimmed whitespace

---

## Migration from Unprotected API

If you have existing transactions from before authentication was added:

1. They won't be accessible (no user association)
2. Delete old test data
3. Register new users
4. Create new transactions with authentication

---

## Next Steps

- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add refresh tokens
- [ ] Add role-based access control
- [ ] Add rate limiting
- [ ] Add social OAuth (Google, Facebook)
