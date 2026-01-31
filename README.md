# CHECK — Advanced Expense Tracker

![Status](https://img.shields.io/badge/Status-Deployed-success?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**CHECK** is a full-stack expense tracking application designed to help users understand and manage their personal finances with clarity. Built using the **MERN stack (MongoDB, Express, React, Node.js)**, it focuses on clean UX, intelligent financial insights, and secure authentication flows.

---

## 🚀 Live Demo

* **Frontend (Vercel):**
  [https://expense-tracker-indol-eight-74.vercel.app](https://expense-tracker-indol-eight-74.vercel.app)

* **Backend API (Render):**
  [https://expense-tracker-backend-e2yj.onrender.com](https://expense-tracker-backend-e2yj.onrender.com)

---

## ✨ Key Features

### 📊 Financial Management

* **Dynamic Dashboard:** Real-time overview of balance, income, and expenses.
* **Transaction Tracking:** Add and delete income/expense records.
* **Category-based Organization:** Expenses grouped by categories such as Food, Rent, Transport, Salary, etc.
* **Monthly Filtering:** View transactions and summaries month-wise.

### 🧠 Insights & Analysis

* **Recurring Transaction Detection:** Identifies subscription-like patterns.
* **Daily Financial Insights:** Contextual tips based on spending behavior.
* **Spending Indicators:** Highlights high-expense categories.

### 🔐 Authentication & Security

* **JWT Authentication:** Secure login system with token-based auth.
* **Password Hashing:** Uses bcrypt for secure credential storage.
* **Forgot Password Flow:** Email-based password reset implemented using **Resend API**.
* **Isolated User Data:** Each user can access only their own transactions.

### 🎨 UI / UX

* **Clean, Minimal Interface:** Professional, distraction-free layout.
* **Fully Responsive:** Optimized for desktop, tablet, and mobile screens.
* **Theme-ready Architecture:** Designed to support dark/light themes.

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Vanilla CSS (CSS variables for consistency)
* Axios
* React Icons
* Chart.js

### Backend

* Node.js
* Express
* MongoDB Atlas
* Mongoose
* Resend (Transactional Emails)
* JWT & bcrypt

### Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

## ⚙️ Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Charan170903/expense-tracker.git
cd expense-tracker
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd ../expense-tracker
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```ini
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/check
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM=CHECK <no-reply@resend.dev>
```

> ℹ️ To send emails to real users in production, a custom domain must be verified in Resend.

---

### Frontend (`expense-tracker/.env`)

```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/forgot-password`
* `POST /api/auth/reset-password`

### Transactions

* `GET /api/transactions`
* `POST /api/transactions`
* `DELETE /api/transactions/:id`

### Insights

* `GET /api/insights/summary`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

Licensed under the **MIT License**.

---

### 👨💻 Developed by **Charankarthikeyan**

GitHub: [https://github.com/Charan170903](https://github.com/Charan170903)
LinkedIn: [https://www.linkedin.com/in/charankarthikeyan-selvakumar-a7a731225/](https://www.linkedin.com/in/charankarthikeyan-selvakumar-a7a731225/)
