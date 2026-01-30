# 📊 Financial Insights API Documentation

## Overview
Read-only endpoints that provide financial insights using MongoDB aggregation queries. All endpoints require authentication.

---

## Endpoints

### 1. Monthly Summary
**GET** `/api/insights/monthly-summary`

Get comprehensive financial summary for a specific month including income, expenses, savings rate, and category breakdown.

**Query Parameters:**
- `year` (optional) - Year (default: current year)
- `month` (optional) - Month 1-12 (default: current month)

**Example Request:**
```bash
GET /api/insights/monthly-summary?year=2026&month=1
Authorization: Bearer <token>
```

**PowerShell:**
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/insights/monthly-summary?year=2026&month=1" -Headers $headers
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": {
      "year": 2026,
      "month": 1,
      "monthName": "January",
      "startDate": "2026-01-01T00:00:00.000Z",
      "endDate": "2026-01-31T23:59:59.999Z"
    },
    "summary": {
      "totalIncome": 50000,
      "totalExpense": 18500,
      "savings": 31500,
      "savingsRate": 63.00,
      "incomeTransactions": 1,
      "expenseTransactions": 12,
      "totalTransactions": 13
    },
    "categories": [
      {
        "type": "expense",
        "category": "Groceries",
        "total": 5000,
        "count": 4,
        "percentage": "27.03"
      },
      {
        "type": "expense",
        "category": "Food & Dining",
        "total": 3500,
        "count": 6,
        "percentage": "18.92"
      }
      // ... more categories
    ]
  }
}
```

**Features:**
- ✅ Total income and expense for the month
- ✅ Savings amount and savings rate percentage
- ✅ Transaction counts by type
- ✅ Category breakdown with percentages
- ✅ MongoDB aggregation for efficient queries

---

### 2. Subscription Detection
**GET** `/api/insights/subscriptions`

Automatically detect recurring/subscription transactions by analyzing patterns in transaction history. Uses deterministic pattern matching (no AI).

**Query Parameters:**
- `minOccurrences` (optional, default: 2) - Minimum number of occurrences to consider as subscription
- `toleranceDays` (optional, default: 3) - Tolerance in days for interval consistency

**Example Request:**
```bash
GET /api/insights/subscriptions?minOccurrences=3&toleranceDays=2
Authorization: Bearer <token>
```

**PowerShell:**
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/insights/subscriptions?minOccurrences=2" -Headers $headers
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "title": "Netflix Subscription",
        "amount": 799,
        "category": "Entertainment",
        "frequency": "Monthly",
        "averageInterval": 30,
        "occurrenceCount": 5,
        "firstOccurrence": "2025-09-15T00:00:00.000Z",
        "lastOccurrence": "2026-01-15T00:00:00.000Z",
        "nextExpectedDate": "2026-02-14T00:00:00.000Z",
        "consistency": "High",
        "transactionIds": ["id1", "id2", "id3", "id4", "id5"],
        "estimatedMonthlyImpact": 799
      },
      {
        "title": "Gym Membership",
        "amount": 1500,
        "category": "Healthcare",
        "frequency": "Monthly",
        "averageInterval": 31,
        "occurrenceCount": 4,
        "consistency": "High",
        "estimatedMonthlyImpact": 1500
      }
      // ... more subscriptions
    ],
    "count": 5,
    "totalMonthlyImpact": 4299,
    "detectionCriteria": {
      "minOccurrences": 2,
      "toleranceDays": 3
    }
  }
}
```

**Detection Algorithm:**
1. Groups transactions by title (case-insensitive) + exact amount
2. Calculates time intervals between occurrences
3. Computes average interval and standard deviation
4. Identifies as subscription if intervals are consistent (low std dev)
5. Determines frequency: Weekly, Biweekly, Monthly, Quarterly, Yearly
6. Predicts next occurrence date
7. Estimates monthly cost impact

**Frequency Detection:**
- **Weekly**: 6-8 days interval
- **Biweekly**: 13-15 days interval
- **Monthly**: 27-33 days interval
- **Quarterly**: 85-95 days interval
- **Yearly**: 360-370 days interval
- **Custom**: Any other consistent interval

**Consistency Levels:**
- **High**: Standard deviation ≤ 1 day
- **Medium**: Standard deviation ≤ 3 days
- **Low**: Standard deviation > 3 days

---

### 3. Year Overview
**GET** `/api/insights/year-overview`

Get comprehensive yearly financial overview with month-by-month breakdown.

**Query Parameters:**
- `year` (optional) - Year (default: current year)

**Example Request:**
```bash
GET /api/insights/year-overview?year=2026
Authorization: Bearer <token>
```

**PowerShell:**
```powershell
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/api/insights/year-overview?year=2026" -Headers $headers
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "summary": {
      "totalIncome": 600000,
      "totalExpense": 285000,
      "totalSavings": 315000,
      "savingsRate": 52.50,
      "averageMonthlyIncome": 50000,
      "averageMonthlyExpense": 23750
    },
    "monthlyBreakdown": [
      {
        "month": 1,
        "monthName": "January",
        "income": 50000,
        "expense": 18500,
        "savings": 31500,
        "savingsRate": 63.00,
        "transactionCount": 13
      },
      {
        "month": 2,
        "monthName": "February",
        "income": 50000,
        "expense": 22000,
        "savings": 28000,
        "savingsRate": 56.00,
        "transactionCount": 15
      }
      // ... months 3-12
    ]
  }
}
```

**Features:**
- ✅ Yearly totals and averages
- ✅ Month-by-month breakdown
- ✅ Savings rate trend
- ✅ Transaction count per month
- ✅ MongoDB aggregation for efficient processing

---

## Technical Details

### MongoDB Aggregation Pipelines

**Monthly Summary Pipeline:**
```javascript
[
  {
    $match: {
      user: userId,
      occurredAt: { $gte: startDate, $lte: endDate }
    }
  },
  {
    $group: {
      _id: '$type',
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  }
]
```

**Year Overview Pipeline:**
```javascript
[
  {
    $match: {
      user: userId,
      occurredAt: { $gte: startOfYear, $lte: endOfYear }
    }
  },
  {
    $group: {
      _id: {
        month: { $month: '$occurredAt' },
        type: '$type'
      },
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.month': 1 }
  }
]
```

---

## Subscription Detection Logic

**Step-by-Step Algorithm:**

1. **Fetch Transactions**: Get all expense transactions for user
2. **Group by Pattern**: Group by `title (lowercase) + amount`
3. **Calculate Intervals**: Compute days between each occurrence
4. **Statistical Analysis**:
   - Average interval
   - Standard deviation (consistency measure)
5. **Filter by Criteria**:
   - Minimum occurrences met
   - Standard deviation within tolerance
6. **Classify Frequency**: Match interval to known patterns
7. **Predict Next Date**: Last date + average interval
8. **Estimate Impact**: Convert to monthly cost equivalent

**Example Calculation:**
```
Netflix: ₹799 on Jan 1, Feb 1, Mar 1, Apr 1
Intervals: [31, 29, 31] days
Average: 30.33 days
Std Dev: 1.15 days → High consistency
Frequency: Monthly (27-33 day range)
Next Expected: May 1
Monthly Impact: ₹799
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized. Please login to access this resource"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error while generating monthly summary"
}
```

---

## Complete Testing Workflow (PowerShell)

```powershell
# 1. Login and get token
$creds = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -Body $creds -ContentType "application/json"
$token = $loginResponse.token
$headers = @{ "Authorization" = "Bearer $token" }

# 2. Get current month summary
Write-Host "`n📊 Monthly Summary:"
$monthly = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/monthly-summary" -Headers $headers
Write-Host "Income: ₹$($monthly.data.summary.totalIncome)"
Write-Host "Expense: ₹$($monthly.data.summary.totalExpense)"
Write-Host "Savings Rate: $($monthly.data.summary.savingsRate)%"

# 3. Detect subscriptions
Write-Host "`n🔄 Subscriptions Detected:"
$subs = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/subscriptions" -Headers $headers
Write-Host "Count: $($subs.data.count)"
Write-Host "Total Monthly Impact: ₹$($subs.data.totalMonthlyImpact)"
$subs.data.subscriptions | ForEach-Object {
    Write-Host "  - $($_.title): ₹$($_.amount) ($($_.frequency))"
}

# 4. Get year overview
Write-Host "`n📅 Year Overview:"
$year = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/year-overview?year=2026" -Headers $headers
Write-Host "Total Income: ₹$($year.data.summary.totalIncome)"
Write-Host "Total Savings: ₹$($year.data.summary.totalSavings)"
Write-Host "Savings Rate: $($year.data.summary.savingsRate)%"
```

---

## Use Cases

### Monthly Budget Tracking
```powershell
# Get January 2026 summary
$jan = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/monthly-summary?year=2026&month=1" -Headers $headers

if ($jan.data.summary.savingsRate -lt 20) {
    Write-Host "⚠️ Low savings rate! Consider reducing expenses."
}
```

### Subscription Management
```powershell
# Find all subscriptions
$subs = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/subscriptions?minOccurrences=3" -Headers $headers

# Calculate yearly cost
$yearlyCost = $subs.data.totalMonthlyImpact * 12
Write-Host "💰 Annual subscription cost: ₹$yearlyCost"
```

### Year-End Review
```powershell
# Compare current year vs last year
$current = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/year-overview?year=2026" -Headers $headers
$previous = Invoke-RestMethod -Uri "http://localhost:5000/api/insights/year-overview?year=2025" -Headers $headers

$improvement = $current.data.summary.savingsRate - $previous.data.summary.savingsRate
Write-Host "📈 Savings rate change: $improvement%"
```

---

## Performance

- **Monthly Summary**: O(n) where n = transactions in month (~instant)
- **Subscription Detection**: O(n log n) where n = expense transactions (seconds for thousands)
- **Year Overview**: O(n) where n = transactions in year (~instant)

All queries use MongoDB indexes for optimal performance.

---

## Limitations

1. **Subscription Detection**:
   - Requires exact title match (case-insensitive)
   - Requires exact amount match
   - Minimum 2 occurrences needed
   - Cannot detect subscriptions with varying amounts

2. **Date Ranges**:
   - Monthly summary limited to single month
   - Year overview limited to single year

3. **No AI**:
   - Pure deterministic logic
   - No machine learning predictions
   - Statistical pattern matching only

---

## Future Enhancements

- [ ] Category spending trends
- [ ] Budget vs actual comparison
- [ ] Spending patterns by day of week
- [ ] Top merchants analysis
- [ ] Cash flow forecasting
- [ ] Goal tracking

---

**Status:** ✅ All insights endpoints operational and tested!
