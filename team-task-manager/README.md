# 🚀 TaskFlow: Advanced Team Workspace

TaskFlow is a high-performance, full-stack project management SaaS designed for modern teams. It combines real-time synchronization, deep analytics, and professional-grade security in a sleek, glassmorphic interface.

**🔗 Live Demo**: [https://remarkable-simplicity-production-ebff.up.railway.app/](https://remarkable-simplicity-production-ebff.up.railway.app/)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-010101?logo=socket.io)

---

## ✨ Key Features

### 🛡️ Command & Control RBAC
Enterprise-grade Role-Based Access Control. **Administrators** have full workspace governance, while **Members** focus on task execution and collaboration.

### 📋 Real-time Kanban Workspace
A dynamic, drag-and-drop workflow visualizer. Changes synchronize across all team members instantly using WebSocket technology.

### 📊 Precision Analytics
Integrated dashboard providing live insights into team productivity, project health, task status breakdowns, and overdue tracking.

### 👥 Team Governance
Streamlined invitation system and workload management. Track team capacity and reassign tasks with a single click.

### 🎨 Premium Experience
State-of-the-art Dark Mode interface built with Tailwind CSS and Framer Motion for smooth, hardware-accelerated animations.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** & **Vite** for blazing fast performance
- **Tailwind CSS** for custom-tokenized design systems
- **Zustand** for lightweight, scalable state management
- **React Query** for efficient server-state synchronization
- **Lucide React** for consistent, modern iconography

### Backend
- **Node.js** & **Express** with a modular controller-service architecture
- **MongoDB** & **Mongoose** for flexible, document-oriented data storage
- **JWT & Bcrypt** for secure, industry-standard authentication
- **Socket.io** for low-latency, bi-directional communication

---

## 📦 Local Deployment

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local instance
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd team-task-manager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with the following:
   # PORT=5000
   # MONGODB_URI=your_mongodb_uri
   # JWT_SECRET=your_jwt_secret
   # CLIENT_URL=http://localhost:5173
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with the following:
   # VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

---

## 🏗️ Project Architecture

```text
├── backend/
│   ├── config/         # Database & environment config
│   ├── controllers/    # Request handlers & logic
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoint definitions
│   └── validators/     # Request validation (Joi)
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── layouts/    # Page wrappers (Auth/Main)
│   │   ├── pages/      # View components
│   │   ├── services/   # API & Socket clients
│   │   └── store/      # Global state (Zustand)
```

---

## 🔐 Security Standards

- **JWT Authentication**: Secure stateless sessions with automatic token expiration.
- **Data Sanitization**: Protection against XSS and NoSQL injection.
- **Rate Limiting**: Brute-force protection on all authentication endpoints.
- **Password Hashing**: Industry-standard Bcrypt salting (12 rounds).
- **CORS Protection**: Strict origin-based access control.

---

## 🚀 Deployment (Railway)

### Backend Configuration
- Root Directory: `/backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Frontend Configuration
- Root Directory: `/frontend`
- Build Command: `npm run build`
- Start Command: `npm run preview` (or static serving)

---

*TaskFlow is built for reliability, speed, and elegance.*
