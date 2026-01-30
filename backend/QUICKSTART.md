# ⚡ Quick Start - Backend

## Start Development Server
```bash
cd backend
npm run dev
```

## Prerequisites Checklist
- [ ] MongoDB is installed
- [ ] MongoDB service is running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured

## Quick MongoDB Check
```bash
# Windows (run as Admin)
net start MongoDB

# macOS/Linux
sudo systemctl status mongodb
```

## Test Endpoints
- Root: http://localhost:5000
- Health: http://localhost:5000/api/health

## Common Commands
```bash
npm run dev      # Development with auto-reload
npm start        # Production mode
npm install      # Install dependencies
```

## MongoDB Not Running?
See `SETUP.md` for detailed instructions.

---
**Backend Port:** 5000  
**Database:** expense-tracker  
**Framework:** Express.js + MongoDB + Mongoose
