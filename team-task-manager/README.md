# 🚀 TaskFlow SaaS - Team Task Manager

A professional-grade, full-stack Team Task Manager SaaS application built with the MERN stack. Designed for high-performance teams that require precision, speed, and real-time collaboration.

## ✨ Features

- **🛡️ Secure Auth**: JWT-based authentication with role-based access control (Admin/Member).
- **📊 Analytics Dashboard**: Real-time insights into project progress, task status, and team productivity using Recharts.
- **📁 Project Management**: Create, update, and monitor multi-member projects with deadline tracking.
- **📋 Kanban Board**: Interactive drag-and-drop workflow management powered by `@hello-pangea/dnd`.
- **💬 Task Collaboration**: Threaded comments and task-specific updates.
- **🔔 Real-time Notifications**: Instant updates via Socket.io for assignments and project changes.
- **🎨 Premium UI**: Modern dark-mode-first design with Tailwind CSS, Framer Motion, and Glassmorphism.

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS (Styling)
- Zustand (State Management)
- TanStack Query (Data Fetching)
- Framer Motion (Animations)
- Recharts (Data Visualization)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose (Database)
- Socket.io (Real-time)
- JWT + Bcrypt (Security)
- Joi + Express-Validator (Validation)

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example` and add your `MONGODB_URI` and `JWT_SECRET`.
4. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 🔑 Demo Credentials
- **Admin**: `admin@demo.com` / `123456`
- **Member**: `user@demo.com` / `123456`

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - New user registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project (Admin/Owner)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Remove project

### Tasks
- `GET /api/tasks` - List tasks with filters
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update status/details
- `POST /api/tasks/:id/comments` - Add collaboration comment

---
Built by Antigravity AI for the Selection Winner Task.
