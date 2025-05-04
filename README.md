## 🏋️ Gym Management System – Fullstack Web App

A modern, full-featured gym management platform designed to streamline operations for gyms and fitness centers. Built using a robust **MERN (MongoDB, Express, React, Node.js)** stack, enhanced with **TanStack Router**, **TanStack Query**, **Shadcn/UI**, and **Razorpay** for seamless UI and payment integration.

---

## 🚀 Features

### 👥 Role-Based Access

- **Admin**

  - Manage users and roles
  - Extend membership validity
  - View and manage trainers and trainees
  - Monitor attendance and payments

- **Trainer**

  - View and manage assigned trainees
  - Track attendance and assign workouts
  - Monitor workout completion

- **Member**

  - View profile, membership validity, and workout stats
  - Mark attendance
  - View and complete assigned workouts
  - Make payments via Razorpay

### 🧾 Payments & Memberships

- Razorpay integration for secure payment
- Manual and automated membership validation
- Admin-controlled membership extensions

### 🏃 Attendance & Workouts

- Attendance marking and tracking (present/absent)
- Workout assignments per trainee
- Workout completion tracking

---

## 🏗️ Tech Stack

| Layer      | Technology                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Frontend   | React, TypeScript, TanStack Router, TanStack Query, Tailwind CSS, Shadcn/UI |
| Backend    | Node.js, Express.js, MongoDB (Mongoose)                                     |
| Auth & JWT | Access + Refresh Tokens, bcrypt                                             |
| Payments   | Razorpay Integration                                                        |
| State/Data | React Query (TanStack Query)                                                |

---

## 📂 Project Structure

```
gym-management/
├── client/           # Frontend (React + Vite)
│   ├── src/
│   ├── index.html
│   └── .env.example
├── server/           # Backend (Node.js + Express)
│   ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── index.js
│   └── .env.example
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Node.js ≥ v18
- MongoDB (Local or Atlas)
- Razorpay Developer Account

---

## 🛠 Backend Setup

1. Navigate to the backend folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Fill in your environment variables:

```env
SERVER_PORT=5000
MONGO_URI=mongodb+srv://<your-mongo-uri>
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

5. Start the server:

```bash
npm run dev
```

---

## 💻 Frontend Setup

1. Navigate to the frontend folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Fill in your environment variables:

```env
VITE_SERVER_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. Start the React frontend:

```bash
npm run dev
```

---

## 🌐 Environment Variables

### Backend (`server/.env.example`)

```env
SERVER_PORT=your_server_port
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend (`client/.env.example`)

```env
VITE_SERVER_BASE_URL=your_vite_server_base_url
VITE_RAZORPAY_KEY_ID=your_vite_razorpay_key_id
```

---

## 📸 UI Highlights

> ✅ _Built with modern, responsive UI using `shadcn/ui`_

- Role-based admin panel
- Trainer dashboard with workout assignment
- Member dashboard with progress tracking
- Payment checkout via Razorpay

_(Add screenshots here if available)_

---

## 📊 Database Models

### User

```ts
{
  username: String,
  password: String,
  role: 'admin' | 'trainer' | 'member',
  isTrainer: Boolean,
  hasPaid: Boolean,
  membershipExpiresAt: Date,
  attendance: [{ date: Date, status: 'Present' | 'Absent' }],
  trainees: [ObjectId]
}
```

### Workout

```ts
{
  trainerId: ObjectId,
  title: String,
  description: String,
  assignedTo: [ObjectId],
  completedBy: [ObjectId],
}
```

---

## 🧪 Development Notes

- Uses `localStorage.getItem("user_id")` for role-based operations instead of auth middleware
- Razorpay checkout runs client-side, with server validation
- Uses TanStack Query for data fetching and cache management
- Designed for extendability (e.g., reminders, analytics, notifications)

---

## ✅ Future Enhancements

- Email notifications on expiry
- Mobile-responsive enhancements
- Analytics for admin
- Auto-renewal reminders

---

## 📄 License

MIT © \[silentFellow]
