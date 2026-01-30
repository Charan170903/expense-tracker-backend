# Expense Tracker Backend

A clean, production-ready Express.js backend for the Expense Tracker application.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/           # Business logic (future)
├── models/                # Mongoose models (future)
├── routes/
│   └── health.js          # Health check endpoint
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── server.js             # Main application entry point
└── package.json          # Dependencies and scripts
```

## ⚙️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create/edit `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   PORT=5000
   NODE_ENV=development
   ```

3. **Ensure MongoDB is running:**
   - Local: Start MongoDB service
   - Cloud: Use MongoDB Atlas connection string

## 🏃 Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 🔍 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status and uptime
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Server is running smoothly",
    "uptime": 123.456,
    "timestamp": "2026-01-30T05:00:00.000Z",
    "environment": "development",
    "mongodb": "connected"
  }
  ```

### Root
- **GET** `/`
- Returns API information and available endpoints

## ✅ What's Complete

- ✅ Express server setup
- ✅ MongoDB connection with Mongoose
- ✅ Environment variable configuration
- ✅ CORS enabled
- ✅ JSON parsing middleware
- ✅ Health check endpoint
- ✅ Error handling middleware
- ✅ Clean folder structure
- ✅ Development tools (nodemon)

## 🔜 Next Steps

- Add transaction models (models/)
- Add transaction controllers (controllers/)
- Add transaction routes (routes/)
- Implement authentication
- Add validation middleware
- Add logging

## 📝 Notes

- No authentication implemented yet (as per requirements)
- No business logic yet (clean foundation only)
- Ready for expansion with models, controllers, and routes
