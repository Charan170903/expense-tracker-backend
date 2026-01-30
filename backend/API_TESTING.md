# 🧪 Transaction API Testing Guide

## Base URL
```
http://localhost:5000/api/transactions
```

## Available Endpoints

### 1. Create Transaction
**POST** `/api/transactions`

**Request Body:**
```json
{
  "title": "Grocery Shopping",
  "amount": 1500.50,
  "category": "Groceries",
  "type": "expense",
  "occurredAt": "2026-01-30T10:00:00.000Z"
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Salary\",\"amount\":50000,\"category\":\"Salary\",\"type\":\"income\",\"occurredAt\":\"2026-01-30T00:00:00.000Z\"}"
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "65b9c...",
    "title": "Grocery Shopping",
    "amount": 1500.50,
    "category": "Groceries",
    "type": "expense",
    "occurredAt": "2026-01-30T10:00:00.000Z",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

---

### 2. Get All Transactions
**GET** `/api/transactions`

**Query Parameters (optional):**
- `type` - Filter by type (income | expense)
- `category` - Filter by category
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `limit` - Max results (default: 100)

**Examples:**
```bash
# Get all transactions
curl http://localhost:5000/api/transactions

# Get only expenses
curl http://localhost:5000/api/transactions?type=expense

# Get transactions in a date range
curl http://localhost:5000/api/transactions?startDate=2026-01-01&endDate=2026-01-31

# Get groceries only
curl http://localhost:5000/api/transactions?category=Groceries
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 25,
  "summary": {
    "totalIncome": 50000,
    "totalExpense": 12500,
    "balance": 37500
  },
  "data": [
    {
      "_id": "65b9c...",
      "title": "Salary",
      "amount": 50000,
      "category": "Salary",
      "type": "income",
      "occurredAt": "2026-01-30T00:00:00.000Z",
      "createdAt": "2026-01-30T11:00:00.000Z"
    }
    // ... more transactions (sorted by occurredAt DESC)
  ]
}
```

---

### 3. Get Single Transaction
**GET** `/api/transactions/:id`

**Example:**
```bash
curl http://localhost:5000/api/transactions/65b9c1234567890abcdef123
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65b9c...",
    "title": "Grocery Shopping",
    "amount": 1500.50,
    "category": "Groceries",
    "type": "expense",
    "occurredAt": "2026-01-30T10:00:00.000Z",
    "createdAt": "2026-01-30T11:00:00.000Z"
  }
}
```

---

### 4. Update Transaction
**PUT** `/api/transactions/:id`

**Request Body (all fields optional):**
```json
{
  "title": "Weekly Groceries",
  "amount": 1800,
  "category": "Groceries",
  "type": "expense",
  "occurredAt": "2026-01-30T12:00:00.000Z"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/transactions/65b9c1234567890abcdef123 \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Updated Title\",\"amount\":2000}"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "_id": "65b9c...",
    "title": "Weekly Groceries",
    "amount": 1800,
    // ... updated fields
  }
}
```

---

### 5. Delete Transaction
**DELETE** `/api/transactions/:id`

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/transactions/65b9c1234567890abcdef123
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully",
  "data": {
    "id": "65b9c1234567890abcdef123"
  }
}
```

---

## Valid Categories

- Food & Dining
- Transportation
- Shopping
- Entertainment
- Bills & Utilities
- Healthcare
- Education
- Travel
- Groceries
- Salary
- Freelance
- Investment
- Gift
- Other

## Valid Types

- `income`
- `expense`

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Transaction title is required",
    "Amount must be greater than 0"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error while creating transaction"
}
```

---

## Quick Test Script (PowerShell)

```powershell
# Create a new expense
$expense = @{
    title = "Lunch at Restaurant"
    amount = 350
    category = "Food & Dining"
    type = "expense"
    occurredAt = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/transactions" -Body $expense -ContentType "application/json"

# Create a new income
$income = @{
    title = "Monthly Salary"
    amount = 50000
    category = "Salary"
    type = "income"
    occurredAt = (Get-Date).ToString("o")
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/transactions" -Body $income -ContentType "application/json"

# Get all transactions
Invoke-RestMethod -Uri "http://localhost:5000/api/transactions"
```

---

## Testing with Postman

1. Import this as a Postman Collection
2. Set base URL: `http://localhost:5000`
3. Test each endpoint
4. Use environment variables for IDs

---

## Notes

- All dates use ISO 8601 format
- Amounts are in rupees (₹)
- Transactions are sorted by `occurredAt` (latest first)
- No authentication required (single-user mode)
- All responses include a `success` boolean field
