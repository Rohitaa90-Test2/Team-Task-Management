# 🎨 Task Manager Frontend

Modern React + Vite + Tailwind CSS frontend with JWT authentication and role-based UI.

**Stack:** React 18 + Vite 5 + Tailwind + Axios + React Router

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Backend URL
Create `.env.local`:
```bash
VITE_API_URL=http://localhost:5000
```

### 3. Start Dev Server
```bash
npm run dev
```

**App Running:** `http://localhost:5173` ✅

### 4. Build for Production
```bash
npm run build
```

Output: `dist/` folder ready for deployment

---

## 🔐 Demo Login

After seeding backend:
- **Email:** admin@example.com
- **Password:** password123

---

## 📋 Pages

| Page | Features |
|------|----------|
| **Login** | Email/password auth |
| **SignUp** | Register new account |
| **Dashboard** | Task stats, overdue tracking |
| **Projects** | Create, view, delete projects |
| **Project Detail** | Tasks + member management |

---

## ✨ Key Features

✅ JWT authentication with auto-logout  
✅ Create projects & assign members  
✅ Create tasks & track status (TODO → IN_PROGRESS → DONE)  
✅ Role-based UI (Admin/Member)  
✅ Toast notifications for all actions  
✅ Responsive design with Tailwind  
✅ Overdue task alerts  

---

## 🔌 API Integration

- **Axios** with request/response interceptors
- **Auto-injects** Bearer token to all requests
- **401 handler** auto-logout on token expiry
- **Services layer** for clean API calls

---

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🚀 Deploy to Railway

1. Push to GitHub
2. Connect repo to Railway
3. Select `/frontend` folder
4. Set: `VITE_API_URL=https://YOUR_BACKEND_URL`
5. Build: `npm install && npm run build`
6. Publish Dir: `dist`

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot POST /api/login" | Check VITE_API_URL matches backend |
| CORS error | Update backend CORS_ORIGIN |
| Blank page on refresh | Configure server for SPA routing |
| Token cleared | localStorage was cleared, login again |

---

**Tech:** React 18 | Vite 5 | Tailwind 3.3 | React Router 6  
**License:** MIT
