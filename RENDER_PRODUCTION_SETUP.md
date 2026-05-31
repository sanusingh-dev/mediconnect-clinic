# Render Production Deployment Setup

## Overview
This guide configures the Mediconnect MERN app on Render with proper CORS, environment variables, and authentication.

---

## Backend Service (Express API)

### Render Service Configuration

**Service**: Web Service (Node.js)
**Build**: `cd backend && npm install`
**Start**: `npm start`

### Environment Variables

Set these in Render Dashboard → Service Settings → Environment:

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@mediconnect.com
ADMIN_PASSWORD=Admin123!
CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com
```

**Critical**: Set `CLIENT_URLS` to your **exact** Render frontend URL (replace `mediconnect-frontend-1l1z` with your actual Render service name).

### CORS Configuration

The backend now:
- ✅ Allows `localhost:5173` (local dev)
- ✅ Allows `localhost:5000` (local API dev)
- ✅ Allows origins from `CLIENT_URLS` env var (Render production frontend)
- ✅ Handles OPTIONS preflight requests globally via `app.options('*', cors())`
- ✅ Supports credentials (cookies/JWT)
- ✅ Allows `Content-Type` and `Authorization` headers

**Code**: `backend/server.js` (lines 26-59)

```javascript
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handles all preflight requests
```

---

## Frontend Service (React + Vite)

### Render Service Configuration

**Service**: Static Site
**Build**: `cd frontend && npm install && npm run build`
**Publish**: `frontend/dist`

OR

**Service**: Web Service (Node.js)
**Build**: `cd frontend && npm install && npm run build`
**Start**: `npm install -g serve && serve -s dist -l 5173`

### Environment Variables

Set these in Render Dashboard → Service Settings → Environment:

```
VITE_API_URL=https://your-backend-service.onrender.com/api
```

Replace `your-backend-service` with your actual Render backend service name.

### Why `VITE_API_URL` is Critical

- ✅ Tells the frontend where the backend API is located
- ✅ Used during build and at runtime
- ✅ Without it, frontend will try `/api` (relative path), which fails when frontend and backend are separate services
- ✅ Must be an absolute URL to the backend service

**Code**: `frontend/src/api/axiosClient.js` (line 4)

```javascript
const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:5000/api' : '/api');
```

---

## Example Render Setup

### Backend Service
- **Name**: `mediconnect-backend`
- **URL**: `https://mediconnect-backend.onrender.com`
- **Env**: `CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com`

### Frontend Service
- **Name**: `mediconnect-frontend-1l1z`
- **URL**: `https://mediconnect-frontend-1l1z.onrender.com`
- **Env**: `VITE_API_URL=https://mediconnect-backend.onrender.com/api`

---

## Verification Checklist

### 1. Check Backend Logs
```
✅ Server running in production mode on port 5000
✅ Allowed CORS origins (2):
   - http://localhost:5173
   - https://mediconnect-frontend-1l1z.onrender.com
✅ Database Status: 🟢 Connected
```

### 2. Check Frontend Console
```
🌐 API Base URL: https://mediconnect-backend.onrender.com/api
```

### 3. Test Login
1. Go to `https://mediconnect-frontend-1l1z.onrender.com`
2. Click "Login"
3. Enter test credentials
4. Check browser console for:
   - ✅ No CORS errors
   - ✅ `[200] /api/auth/login` in network tab
   - ✅ JWT token stored in localStorage
5. Check backend logs for:
   - ✅ No "CORS blocked" errors
   - ✅ Successful login message

### 4. Test Session Persistence
1. Login successfully
2. Refresh page
3. Verify:
   - ✅ User stays logged in
   - ✅ Navbar shows user profile
   - ✅ No "Network Error" messages

### 5. Test Dark Mode
1. Click moon/sun icon in navbar
2. Verify theme persists after refresh

### 6. Test Logout
1. Click user profile menu
2. Click "Logout"
3. Verify:
   - ✅ Redirected to home page
   - ✅ Navbar shows "Login / Register"
   - ✅ localStorage cleared

---

## Common Issues & Solutions

### ❌ "CORS blocked request from origin"

**Cause**: `CLIENT_URLS` env var not set or incorrect.

**Fix**:
1. Check backend logs show correct origin in "Allowed CORS origins"
2. Set `CLIENT_URLS` to your exact Render frontend URL
3. Redeploy backend

### ❌ "Network Error" on login

**Cause**: `VITE_API_URL` not set or incorrect.

**Fix**:
1. Check frontend console shows correct API URL
2. Set `VITE_API_URL` to your backend service URL
3. Rebuild and redeploy frontend

### ❌ OPTIONS request fails

**Cause**: Missing preflight handler.

**Fix**: Already applied in `backend/server.js`:
```javascript
app.options('*', cors(corsOptions));
```

### ❌ JWT token not sent

**Cause**: Authorization header not set.

**Fix**: Already applied in `frontend/src/api/axiosClient.js`:
```javascript
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

---

## Production Build Testing

### Before deploying to Render, test locally:

```bash
# Terminal 1: Backend
cd backend
NODE_ENV=production npm start

# Terminal 2: Frontend
cd frontend
npm run build
npm install -g serve
serve -s dist -l 3000

# Visit http://localhost:3000
# Backend API at http://localhost:5000/api
```

Set env vars:
- Backend: `CLIENT_URLS=http://localhost:3000`
- Frontend: `VITE_API_URL=http://localhost:5000/api`

---

## Files Modified for CORS Fix

1. **backend/server.js**
   - Added `app.options('*', cors(corsOptions))` global preflight handler
   - Added `http://localhost:5000` to default allowed origins
   - Improved CORS error logging to show blocked origin vs allowed origins
   - Better startup logging for production guidance

2. **frontend/src/api/axiosClient.js**
   - Smart fallback to `/api` relative path only in production
   - Warning log when `VITE_API_URL` is missing in production
   - Better request/response logging

3. **frontend/src/context/AuthContext.jsx**
   - Safe localStorage parsing (corrupted data won't crash)
   - Detailed request/response logging for debug
   - Auto-cleanup of invalid auth state

---

## Next Steps

1. ✅ Set `CLIENT_URLS` in backend Render env var
2. ✅ Set `VITE_API_URL` in frontend Render env var
3. ✅ Trigger rebuild/redeploy on both services
4. ✅ Verify login works without CORS errors
5. ✅ Monitor backend logs for successful requests
