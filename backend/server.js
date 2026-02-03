require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const insightRoutes = require('./routes/insights');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().then(() => {
    app.locals.mongoStatus = 'connected';
}).catch(() => {
    app.locals.mongoStatus = 'disconnected';
});

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Define base allowed origins
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://expense-tracker-indol-eight-74.vercel.app'
        ];

        // Add origins from environment variables if present
        if (process.env.ALLOWED_ORIGINS) {
            const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
            allowedOrigins.push(...envOrigins);
        }

        // Exact match check
        const isAllowed = allowedOrigins.includes(origin);

        if (isAllowed) {
            callback(null, true);
        } else {
            // Log but don't throw - this prevents the 500 error
            // Standard CORS behavior: browser blocks if origin isn't returned
            console.warn(`CORS: Origin ${origin} not explicitly allowed. Use ALLOWED_ORIGINS to add it.`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

// CORS middleware - handles both preflight and regular requests
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: '💰 Expense Tracker API',
        version: '3.0.0',
        endpoints: {
            health: '/api/health',
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                me: 'GET /api/auth/me (Protected)'
            },
            transactions: '/api/transactions (Protected)',
            insights: {
                monthlySummary: 'GET /api/insights/monthly-summary (Protected)',
                subscriptions: 'GET /api/insights/subscriptions (Protected)',
                yearOverview: 'GET /api/insights/year-overview (Protected)'
            }
        }
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`📡 Listening on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log('═══════════════════════════════════════════');
});

module.exports = app;
