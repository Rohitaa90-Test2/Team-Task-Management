# 🚀 Task Manager - Full Stack Application

Complete team task management system with real-time collaboration, role-based access, and production-ready deployment.

---

## 📂 Project Structure

```
├── backend/          REST API (Node.js + Express + PostgreSQL)
├── frontend/         React + Vite + Tailwind CSS
└── README.md         This file
```

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Backend API** | https://team-task-management-production-3eac.up.railway.app |
| **Frontend App** | https://sunny-enchantment-production-4687.up.railway.app |

---

## 🔐 Demo Credentials

```
Email:    admin@example.com
Password: password123
```

---

## ⚡ Quick Start

### **Backend Setup**
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 🎯 Key Features

✅ **Authentication:** JWT-based login/signup with 7-day expiry  
✅ **Projects:** Create, update, delete with team collaboration  
✅ **Tasks:** CRUD operations with status tracking (TODO → IN_PROGRESS → DONE)  
✅ **Members:** Role-based access (ADMIN/MEMBER)  
✅ **Dashboard:** Analytics & overdue task tracking  
✅ **Security:** Bcrypt hashing, CORS, Helmet headers  
✅ **Database:** PostgreSQL with Prisma ORM  

---

## 📁 Backend

**Tech:** Node.js | Express 4.18 | PostgreSQL | Prisma 5  
**Port:** 5000 (local), 8080 (production)

For detailed setup, see [backend/README.md](backend/README.md)

**Key endpoints:**
- `POST /api/auth/signup, login`
- `GET/POST /api/projects`
- `GET/POST /api/tasks/project/:projectId`
- `GET /api/dashboard/user`

---

## 🎨 Frontend

**Tech:** React 18 | Vite 5 | Tailwind 3.3 | React Router 6  
**Port:** 5173 (local), Railway (production)

For detailed setup, see [frontend/README.md](frontend/README.md)

**Pages:**
- Login & Sign Up
- Dashboard (stats & overdue tasks)
- Projects (manage teams)
- Project Details (tasks & members)

---

## 🚀 Deployment (Railway)

Both services deployed on Railway with auto-deploy on GitHub push.

**Environment Variables Set:**
- Backend: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
- Frontend: `VITE_API_URL`

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Check `CORS_ORIGIN` in backend variables |
| API not found | Verify `VITE_API_URL` points to correct backend |
| Database error | Run `npm run prisma:migrate` |
| Module not found | Run `npm install && npm run prisma:generate` |

---

## 📚 Documentation

- [Backend README](backend/README.md) - API docs, scripts, deployment
- [Frontend README](frontend/README.md) - Setup, features, components

---

## 🏗️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite 5 + Tailwind 3.3 |
| **Backend** | Node.js + Express 4.18 |
| **Database** | PostgreSQL (Neon) + Prisma 5 |
| **Auth** | JWT + Bcrypt |
| **Deployment** | Railway |

---

## 📝 License

MIT License - Free to use and modify

---

**Built with ❤️ for team collaboration**
