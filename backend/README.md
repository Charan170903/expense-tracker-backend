# CHECK Backend API

Express.js REST API for the CHECK expense tracking application.

## Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Validation**: Express Validator
- **Security**: CORS, Helmet (planned)

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

## Scripts

```bash
npm start       # Production server
npm run dev     # Development with nodemon
```

## Environment Variables

See `.env.example` for required variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated CORS origins

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Insights
- `GET /api/insights/monthly-summary` - Monthly statistics
- `GET /api/insights/subscriptions` - Detect recurring expenses
- `GET /api/insights/year-overview` - Yearly spending overview

### Health
- `GET /api/health` - Server health check

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── transactionController.js
│   ├── insightController.js
│   └── README.md
├── middleware/
│   └── auth.js            # JWT verification
├── models/
│   ├── User.js            # User schema
│   ├── Transaction.js     # Transaction schema
│   └── README.md
├── routes/
│   ├── auth.js
│   ├── transactions.js
│   ├── insights.js
│   ├── health.js
│   └── README.md
├── .env.example
├── .gitignore
├── server.js              # Entry point
├── package.json
└── README.md
```

## Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB integration with Mongoose
- ✅ Input validation
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Health check endpoint
- ✅ Transaction CRUD operations
- ✅ Financial insights & analytics

## Deployment

Deployed on Render: https://expense-tracker-backend-e2yj.onrender.com

See main [DEPLOYMENT.md](../DEPLOYMENT.md) for details.

## License

MIT
