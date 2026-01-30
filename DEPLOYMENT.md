# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will walk you through deploying your Expense Tracker application to production.

**Stack:**
- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB Atlas (Cloud)

---

## 📋 Prerequisites

Before you begin, make sure you have:
- [ ] GitHub account (to connect repositories)
- [ ] Vercel account (https://vercel.com)
- [ ] Render account (https://render.com)
- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

---

## Part 1: Set Up MongoDB Atlas (Database)

### Step 1: Create MongoDB Atlas Cluster

1. **Sign up/Login** to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. **Create a new cluster** (choose FREE tier)
   - Cloud Provider: AWS, GCP, or Azure
   - Region: Choose closest to your users
   - Cluster Tier: M0 Sandbox (FREE)
3. **Wait** for cluster to be created (~5 minutes)

### Step 2: Configure Database Access

1. **Database Access** (left sidebar) → **Add New Database User**
   - Authentication Method: Password
   - Username: `expense-tracker-admin` (or your choice)
   - Password: Generate a strong password (SAVE THIS!)
   - Database User Privileges: Read and write to any database
   - Click **Add User**

2. **Network Access** (left sidebar) → **Add IP Address**
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Render to connect
   - Click **Confirm**

### Step 3: Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Driver: Node.js
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<username>` and `<password>` with your database user credentials
6. **Add database name** before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```
7. **SAVE THIS** - you'll need it for Render!

---

## Part 2: Deploy Backend to Render

### Step 1: Push to GitHub

```bash
# If not already initialized
cd backend
git init
git add .
git commit -m "Prepare backend for deployment"

# Create a new repository on GitHub named "expense-tracker-backend"
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Login to Render**: https://render.com
2. Click **New +** → **Web Service**
3. **Connect your GitHub repository**: `expense-tracker-backend`
4. **Configure the service**:

   | Field | Value |
   |-------|-------|
   | Name | `expense-tracker-backend` |
   | Region | Choose closest to you |
   | Branch | `main` |
   | Root Directory | (leave empty or `./`) |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | `Free` |

5. **Add Environment Variables** (click **Advanced** → **Add Environment Variable**):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string from Part 1 |
   | `JWT_SECRET` | Generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
   | `JWT_EXPIRE` | `30d` |
   | `ALLOWED_ORIGINS` | (leave empty for now, update after frontend deployment) |

6. Click **Create Web Service**
7. **Wait** for deployment (~5 minutes)
8. Once deployed, **copy your backend URL**: `https://expense-tracker-backend-xxxx.onrender.com`

### Step 3: Test Backend

Visit your backend URL and you should see:
```json
{
  "message": "💰 Expense Tracker API",
  "version": "3.0.0",
  "endpoints": { ... }
}
```

Test health endpoint: `https://your-backend-url.onrender.com/api/health`

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Push to GitHub

```bash
cd expense-tracker
git init
git add .
git commit -m "Prepare frontend for deployment"

# Create repository on GitHub: "expense-tracker-frontend"
git remote add origin https://github.com/YOUR_USERNAME/expense-tracker-frontend.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Login to Vercel**: https://vercel.com
2. Click **Add New...** → **Project**
3. **Import** your GitHub repository: `expense-tracker-frontend`
4. **Configure Project**:

   | Field | Value |
   |-------|-------|
   | Framework Preset | Vite |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

5. **Add Environment Variable**:
   - Click **Environment Variables**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (your Render backend URL + `/api`)
   - Apply to: Production, Preview, Development

6. Click **Deploy**
7. **Wait** for deployment (~2 minutes)
8. Once deployed, **copy your frontend URL**: `https://expense-tracker-frontend.vercel.app`

---

## Part 4: Final Configuration

### Update CORS on Backend

1. Go to **Render Dashboard** → Your Backend Service
2. Go to **Environment** tab
3. Update `ALLOWED_ORIGINS`:
   ```
   https://expense-tracker-frontend.vercel.app
   ```
   (Add your actual Vercel URL - no trailing slash)
4. **Save Changes** - Render will automatically redeploy

---

## Part 5: Test Your Production App

### 1. Test Frontend
Visit your Vercel URL: `https://expense-tracker-frontend.vercel.app`

### 2. Test Registration
- Click "Register"
- Create a new account
- Should redirect to dashboard

### 3. Test Transactions
- Add a transaction
- Delete a transaction
- Filter by month

### 4. Check Browser Console
- Open DevTools (F12)
- Console should have no CORS errors
- Network tab should show successful API calls to Render backend

---

## 🔧 Troubleshooting

### Frontend can't connect to Backend (CORS errors)

**Problem**: Console shows CORS error
**Solution**: 
1. Check `ALLOWED_ORIGINS` in Render includes your exact Vercel URL
2. Make sure `VITE_API_URL` in Vercel is correct
3. Redeploy both services

### MongoDB Connection Timeout

**Problem**: Backend logs show MongoDB connection error
**Solution**:
1. Check MongoDB Atlas Network Access allows 0.0.0.0/0
2. Verify connection string is correct (username, password, database name)
3. Check database user has read/write permissions

### "Cannot GET /" on Frontend Routes

**Problem**: Refreshing page shows 404
**Solution**: Already handled by `vercel.json` configuration (SPA routing)

### Render Free Tier Spins Down

**Problem**: First request after inactivity is slow
**Solution**: This is expected on free tier. Backend spins down after 15 minutes of inactivity.
- First request wakes it up (~30 seconds)
- Consider upgrading to paid plan for production

---

## 📊 Monitoring

### Backend Health Check (Render)
- URL: `https://your-backend-url.onrender.com/api/health`
- Render automatically monitors this endpoint

### Vercel Analytics
- Go to Vercel Dashboard → Your Project → Analytics
- Track page views, performance, etc.

### Render Logs
- Go to Render Dashboard → Your Service → Logs
- Real-time server logs

---

## 🔄 Continuous Deployment

Both Vercel and Render automatically redeploy when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature XYZ"
git push origin main
```

- **Vercel**: Auto-deploys frontend (~2 min)
- **Render**: Auto-deploys backend (~5 min)

---

## 🔐 Security Checklist

- [x] JWT_SECRET is strong and random
- [x] MongoDB connection string is not in code
- [x] CORS is configured with specific origins
- [x] Environment variables are in Vercel/Render (not in code)
- [x] .env files are in .gitignore
- [ ] Enable 2FA on MongoDB Atlas
- [ ] Review Render/Vercel access logs periodically

---

## 💰 Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| **Vercel** | Hobby | **FREE** |
| **Render** | Free | **FREE** (with limitations) |
| **MongoDB Atlas** | M0 Sandbox | **FREE** |
| **Total** | | **$0/month** 🎉 |

### Free Tier Limits:
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: 750 hours/month, spins down after inactivity
- **MongoDB Atlas**: 512MB storage, shared cluster

---

## 🚀 Production URLs

After deployment, update this section with your URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas Cluster

---

## 📝 Quick Reference Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Test Backend Locally with Production DB
```bash
# Update backend/.env with MongoDB Atlas connection string
cd backend
npm run dev
```

### Build Frontend for Testing
```bash
cd expense-tracker
npm run build
npm run preview  # Test production build locally
```

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (optional)
   - Vercel: Add custom domain in project settings
   - Update ALLOWED_ORIGINS in Render

2. **Monitoring & Analytics**
   - Set up error tracking (Sentry, LogRocket)
   - Enable Vercel Analytics

3. **Performance Optimization**
   - Enable Vercel Edge Functions if needed
   - Consider upgrading Render to prevent spin-down

4. **Backup Strategy**
   - MongoDB Atlas auto-backups (available on paid tiers)
   - Export data periodically

---

**Congratulations! Your app is now live! 🎉**

If you encounter any issues, refer to the Troubleshooting section or check the platform-specific documentation.
