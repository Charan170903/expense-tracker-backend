# 📊 CHECK - High-Intelligence Personal Finance Manager

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/status-production--ready-success?style=for-the-badge)
![Node](https://img.shields.io/badge/node-%3E%2020.19.0-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/react-19.2.0-61dafb?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**The intelligent way to track, analyze, and master your money.**

[Live Application](https://expense-tracker-indol-eight-74.vercel.app) • [Backend API](https://expense-tracker-backend-e2yj.onrender.com) • [Report Bug](https://github.com/Charan170903/expense-tracker/issues)

</div>

---

## 🎯 Overview

**CHECK** is a professional-grade, full-stack personal finance management suite built with the MERN stack. It balances a sophisticated corporate aesthetic with high-performance logic engines to provide users with a "Financial Co-pilot" experience. 

Unlike basic budget trackers, CHECK analyzes spending velocity, detects recurring subscriptions through title-matching heuristics, and provides daily contextual insights to improve financial habits.

---

## ✨ Features

### 🧠 Intelligent Engines
- 🔄 **Subscription Detector** - Automatically identifies recurring monthly bills and subscriptions.
- 📈 **Spending Drift Engine** - Analyzes category spending against historical averages.
- 💡 **Daily Contextual Tips** - Real-time financial advice tailored to your current balance.
- 🎯 **Micro-Leak Detector** - Spots small, frequent expenses that drain your budget.

### 🔐 Core Functionality
- **Secure Authentication** - JWT-based sessions with bcrypt password hashing.
- **Transaction Management** - Rapid entry for income and expenses with 14 categories.
- **Time-Based Context** - Filter views by specific months or relative windows (3/6/12 months).
- **Global Balance** - Real-time calculation of net position across all historical data.

### 🎨 User Experience
- **Premium UI** - Clean, slate-sage professional design system.
- **Responsive Dashboard** - Optimized for desktop, tablet, and mobile.
- **Micro-Interactions** - Smooth transitions and interactive data cards.
- **End-of-Month Awareness** - Smart UI alerts during the final 7 days of the month.

---

## 🏗️ Technical Architecture

### 🛠️ Stack
*   **Frontend**: React 19, Vite, Axios, DayJS, React Icons.
*   **Backend**: Node.js, Express.js 5.x.
*   **Database**: MongoDB Atlas (Cloud).
*   **Deployment**: Vercel (Frontend) + Render (Backend).

### 📁 Project Structure
```text
expensetrack/
├── backend/                    # Express.js API
│   ├── controllers/            # Logic handlers
│   ├── middleware/             # Auth & Error handling
│   ├── models/                 # Mongoose Schemas
│   └── routes/                 # API Endpoints
└── expense-tracker/            # React Frontend (Vite)
    ├── src/components/         # UI Elements
    ├── src/context/            # State Providers
    ├── src/services/           # API Client (Axios)
    └── src/utils/              # Insights & Logic Engines
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB Atlas account

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Charan170903/expense-tracker.git
   cd expense-tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env with MONGODB_URI and JWT_SECRET
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../expense-tracker
   npm install
   # Create .env with VITE_API_URL
   npm run dev
   ```

---

## 📡 API Documentation (Selected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return token |
| `GET` | `/api/transactions` | Fetch user transaction history |
| `POST` | `/api/transactions` | Log a new income/expense item |
| `GET` | `/api/insights/monthly` | Get drift and pattern analysis |

---

## � Roadmap
- [ ] **Dark Mode** - Contextual theme switching (v1.1).
- [ ] **Data Export** - PDF/CSV generation for accounting.
- [ ] **Budget Limits** - Active category spending alerts.
- [ ] **Charts** - Visual spending breakdown via Recharts.

---

## 👤 Author

**Charan Karthikeyan**
- **GitHub**: [@Charan170903](https://github.com/Charan170903)
- **LinkedIn**: [Charankarthikeyan Selvakumar](https://www.linkedin.com/in/charankarthikeyan-selvakumar-a7a731225/)
- **Email**: charankarthikeyan7@gmail.com

---

<div align="center">

**Built with ❤️ using the MERN stack**  
*Master your finances with precision.*

</div>
