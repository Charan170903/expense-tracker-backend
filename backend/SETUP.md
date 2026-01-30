# 🚀 Backend Setup Guide

This guide will help you get the Express.js backend running with MongoDB.

## Prerequisites

Before running the backend, ensure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB installed locally OR MongoDB Atlas account

## Step 1: Install MongoDB

### Option A: Local MongoDB (Recommended for Development)

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB with default settings
3. Start MongoDB service:
   ```bash
   # Run as Administrator
   net start MongoDB
   ```

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option B: MongoDB Atlas (Cloud)

1. Create account at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env` file with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

## Step 2: Verify MongoDB is Running

```bash
# Test local MongoDB connection
mongo --eval "db.runCommand({ ping: 1 })"
```

If successful, you should see: `{ ok: 1 }`

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

## Step 4: Configure Environment

Make sure `.env` file exists with correct settings:

```env
MONGODB_URI=mongodb://localhost:27017/expense-tracker
PORT=5000
NODE_ENV=development
```

## Step 5: Start the Server

**Development mode (recommended):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## Step 6: Verify Server is Running

You should see output like:
```
═══════════════════════════════════════════
🚀 Server running in development mode
📡 Listening on port 5000
🌐 API URL: http://localhost:5000
💚 Health Check: http://localhost:5000/api/health
═══════════════════════════════════════════
✅ MongoDB Connected: localhost
📦 Database: expense-tracker
```

## Step 7: Test the API

Open your browser or use curl to test:

**Browser:**
- Visit: http://localhost:5000
- Visit: http://localhost:5000/api/health

**Command Line:**
```bash
curl http://localhost:5000/api/health
```

Expected response:
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

## 🔧 Troubleshooting

### Error: "MongoDB Connection Error"
- **Cause:** MongoDB is not running
- **Solution:** Start MongoDB service (see Step 1)

### Error: "EADDRINUSE: address already in use"
- **Cause:** Port 5000 is already in use
- **Solution:** Change PORT in `.env` file or stop the process using port 5000

### Error: "Cannot find module 'express'"
- **Cause:** Dependencies not installed
- **Solution:** Run `npm install`

### MongoDB Connection Timeout
- **Cause:** Wrong connection string or network issue
- **Solution:** Verify `MONGODB_URI` in `.env` file

## 📚 Next Steps

Once the server is running successfully:
1. ✅ Verify health endpoint works
2. 🔜 Add Transaction model
3. 🔜 Add Transaction routes and controllers
4. 🔜 Implement authentication
5. 🔜 Connect frontend to backend

## 🆘 Additional Help

- MongoDB Docs: https://docs.mongodb.com/
- Express.js Docs: https://expressjs.com/
- Mongoose Docs: https://mongoosejs.com/

---

**Status:** ✅ Backend foundation is complete and ready for development!
