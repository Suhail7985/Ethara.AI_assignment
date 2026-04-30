# 🚀 TaskFlow: Professional Team Task Manager

TaskFlow is a high-performance, full-stack SaaS platform designed for modern teams to manage projects, delegate tasks, and track productivity with a strict administrative hierarchy.

## ✨ Key Features

- **🛡️ Command & Control RBAC**: Strict role-based access control where Admins manage work and Members execute tasks.
- **📋 Dynamic Kanban Board**: Real-time task visualization with drag-and-drop workflow management.
- **📊 Deep Analytics**: Live workspace overview with productivity efficiency, status breakdown, and overdue tracking.
- **👥 Team Management**: Professional invitation system and member workload tracking (Admin Only).
- **🎨 Premium UI/UX**: State-of-the-art Glassmorphism design with Dark Mode support and responsive mobile optimization.
- **🔐 Secure Auth**: JWT-based authentication with secure profile and password management.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, React Query, Zustand.
- **Backend**: Node.js, Express.js, Socket.io (Real-time events).
- **Database**: MongoDB with Mongoose ODM.
- **Deployment**: Railway (Unified Full-Stack Service).

## 🌐 Live Deployment

**Live URL**: [Insert your Railway URL here]

### Railway Deployment Steps:
1. Connect your GitHub repository to **Railway.app**.
2. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for token signing.
   - `NODE_ENV`: `production`
3. Railway will automatically detect the root `package.json` and deploy the unified service.

## 📦 Local Setup

1. **Install Dependencies**:
   ```bash
   npm run install-all
   ```

2. **Configure Environment**:
   Create a `.env` file in the `backend/` directory with your MongoDB and JWT credentials.

3. **Run Application**:
   ```bash
   # Start Backend (Port 5000)
   npm start --prefix backend

   # Start Frontend (Port 5173)
   npm start --prefix frontend
   ```

---
*Built for the Ethara.AI Full-Stack Development Assignment.*
