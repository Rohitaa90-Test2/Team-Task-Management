# 🚀 Task Manager Backend API

REST API for team task management with JWT authentication, PostgreSQL, and role-based access control.

**Stack:** Node.js + Express + PostgreSQL (Neon) + Prisma

---

## ⚡ Quick Start

### 1. Install & Setup
```bash
cd backend
npm install
npm run prisma:generate
```

### 2. Configure `.env`
```bash
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxxxx.neon.tech/neondb?sslmode=require"
JWT_SECRET="task_manager_secret_key_minimum_32_characters_long_here"
JWT_EXPIRE="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

### 3. Setup Database
```bash
npm run prisma:migrate
npm run seed          # Demo data: admin@, john@, jane@example.com / password123
```

### 4. Start Server
```bash
npm run dev          # http://localhost:5000
```

---

## 🔐 Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | password123 | Admin |
| john@example.com | password123 | Member |
| jane@example.com | password123 | Member |

---

## 📚 API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)

### Projects
- `GET /api/projects` - List all
- `POST /api/projects` - Create
- `GET /api/projects/:id` - Get details
- `PUT /api/projects/:id` - Update
- `DELETE /api/projects/:id` - Delete
- `POST /api/projects/:id/members` - Add member
- `PUT /api/projects/:id/members/:memberId` - Update role
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Tasks
- `GET /api/tasks/project/:projectId` - List tasks
- `POST /api/tasks/project/:projectId` - Create
- `PATCH /api/tasks/:projectId/:taskId/status` - Update status
- `DELETE /api/tasks/:projectId/:taskId` - Delete

### Dashboard
- `GET /api/dashboard/user` - User stats
- `GET /api/dashboard/project/:projectId` - Project stats

---

## 🗄️ Database Schema

**Tables:** users, projects, project_members, tasks
**Roles:** ADMIN, MEMBER
**Task Status:** TODO, IN_PROGRESS, DONE

---

## 📦 Scripts

```bash
npm run dev                # Start with hot reload
npm run start              # Production start
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # UI for database (http://localhost:5555)
npm run seed               # Seed demo data
```

---

## 🚀 Deploy to Railway

1. Push to GitHub
2. Connect repo to Railway
3. Select `/backend` folder
4. Set environment variables (DATABASE_URL, JWT_SECRET, CORS_ORIGIN)
5. Build: `npm install`
6. Start: `npm run seed && npm start`

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection failed | Check DATABASE_URL in .env |
| JWT error | Verify JWT_SECRET in .env |
| CORS error | Update CORS_ORIGIN to frontend URL |
| Module not found | Run `npm install && npm run prisma:generate` |

---
