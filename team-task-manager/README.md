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

**Live URL**: [Insert your Frontend Railway URL here]

### Railway Deployment Steps (Separate Services):
This repository is a "Monorepo". You will create **TWO** services on Railway pointing to the same GitHub repository.

#### 1. Deploy the Backend Service
1. On Railway, click **New Project** -> **Deploy from GitHub repo** -> Select this repo.
2. Go to the new service's **Settings** -> **Root Directory** and type `/backend`.
3. Go to the **Variables** tab and add:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for token signing.
   - `PORT`: `5000`
4. Go to **Settings** -> **Networking** and click "Generate Domain" (Copy this URL, you need it for the frontend).

#### 2. Deploy the Frontend Service
1. Click **New** (top right) -> **GitHub Repo** -> Select this repo again.
2. Go to the new frontend service's **Settings** -> **Root Directory** and type `/frontend`.
3. Go to the **Variables** tab and add:
   - `VITE_API_URL`: The URL you copied from the backend (e.g., `https://backend-production.up.railway.app/api`).
4. Go to **Settings** -> **Networking** and generate a domain.

#### 3. Connect them (CORS)
1. Go back to your **Backend Service** -> **Variables**.
2. Add `CLIENT_URL` and paste your Frontend's generated domain (e.g., `https://frontend-production.up.railway.app`).

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
