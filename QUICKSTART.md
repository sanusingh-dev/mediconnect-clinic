# Quick Start Guide - Mediconnect Clinic Management System

## Prerequisites
- Node.js v16+
- npm
- MongoDB Atlas account

## 1-Minute Setup

### Backend
```bash
cd backend
npm install
npm run dev
```
✅ Should show: `🟢 Connected` to MongoDB

### Frontend (in new terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Should open: http://localhost:5173

---

## Default Login Credentials

**Admin:**
- Email: `admin@mediconnect.com`
- Password: `Admin123!`

---

## Important URLs

| Purpose | URL | Notes |
|---------|-----|-------|
| Frontend | `http://localhost:5173` | React Vite app |
| Backend API | `http://localhost:5000/api` | Express server |
| API Health | `http://localhost:5000/api/health` | Status check |
| MongoDB | MongoDB Atlas Cloud | Check status in logs |

---

## Troubleshooting

### Backend won't start

**Check MongoDB:**
```bash
# Look for this in logs:
✅ [DB] MongoDB connected successfully!
```

**If connection fails:**
1. Check `.env` has `MONGO_URI`
2. Verify MongoDB Atlas network access allows your IP
3. Check internet connection to `cluster0.xwnfjcw.mongodb.net`

### Frontend shows white screen

**Check browser console for errors:**
- F12 → Console tab
- Should see: `🌐 API Base URL: http://localhost:5000/api`

**If you see API errors:**
1. Verify backend is running on port 5000
2. Check `.env` has `VITE_API_URL=http://localhost:5000/api`

### CORS errors in browser console

**Ensure both are running:**
- ✅ Backend: `npm run dev` on port 5000
- ✅ Frontend: `npm run dev` on port 5173

---

## Project Structure

```
project2/
├── backend/               # Express + MongoDB API
│   ├── config/db.js      # MongoDB connection
│   ├── server.js         # Server setup
│   ├── .env              # Environment variables
│   └── routes/           # API endpoints
├── frontend/             # React + Vite app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page routes
│   │   ├── services/     # API calls
│   │   └── context/      # Auth/Theme state
│   └── .env              # API URL config
└── docs/                 # Setup guides
```

---

## Common Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Production start
npm run build    # (if applicable)
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview build
```

---

## Features

✅ Patient Management
✅ Doctor Profiles
✅ Appointment Booking
✅ Token System
✅ Admin Dashboard
✅ User Authentication
✅ Dark Mode
✅ Responsive Design

---

## Support

1. Check [SETUP.md](./SETUP.md) for detailed setup
2. Check [DB_CONNECTION_FIX_REPORT.md](./DB_CONNECTION_FIX_REPORT.md) for connection issues
3. Check logs in terminal for specific errors

---

## Next Steps

1. ✅ Backend running and connected
2. ⏭️ Frontend running on http://localhost:5173
3. ⏭️ Login with admin credentials
4. ⏭️ Explore dashboards
5. ⏭️ Test features

**Backend Terminal Output Indicates Success:**
```
============================================================
✅ Server running in development mode on port 5000
✅ API Base URL: http://localhost:5000/api
✅ CORS Origin: http://localhost:5173
✅ Database Status: 🟢 Connected
============================================================
```
