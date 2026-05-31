# CORS & Production Deployment - Code Changes Summary

## Issue
Render frontend (`https://mediconnect-frontend-1l1z.onrender.com`) was getting CORS errors:
```
CORS blocked request from origin: https://mediconnect-frontend-1l1z.onrender.com
[ERROR 500] OPTIONS /api/auth/login Not allowed by CORS
[ERROR 500] OPTIONS /api/auth/me Not allowed by CORS
[ERROR 500] OPTIONS /api/auth/register/doctor Not allowed by CORS
```

---

## Root Causes

1. **Missing Preflight Handler**: Backend didn't have `app.options('*', cors())` to handle OPTIONS requests
2. **Env Var Not Set**: `CLIENT_URLS` env var was empty, so the Render frontend origin wasn't in allowed list
3. **Incomplete CORS Config**: Origin check was too strict without proper fallbacks
4. **No Production Guidance**: Users didn't know they needed to set `CLIENT_URLS` and `VITE_API_URL`

---

## Fixed Files

### 1. backend/server.js

#### Change 1A: Expanded Default Origins (Line 26-31)
**Before:**
```javascript
const defaultOrigins = ['http://localhost:5173'];
```

**After:**
```javascript
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];
```

#### Change 1B: Improved CORS Warning (Line 38-44)
**Before:**
```javascript
if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
  console.warn('⚠️ No CLIENT_URL or CLIENT_URLS defined in production. Set your deployed frontend origin(s) to avoid CORS failures.');
}
```

**After:**
```javascript
if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
  console.warn(
    '⚠️ [CORS] No CLIENT_URL or CLIENT_URLS defined in production.\n' +
    '   Set environment variable CLIENT_URLS to your deployed frontend origin(s).\n' +
    '   Example: CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com\n' +
    '   For multiple origins: CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com,https://yourdomain.com'
  );
}
```

#### Change 1C: Better CORS Error Logging (Line 47-52)
**Before:**
```javascript
origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
  return callback(new Error('Not allowed by CORS'));
},
```

**After:**
```javascript
origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  console.error(
    `❌ [CORS] Request blocked from origin: ${origin}\n` +
    `   Allowed origins: ${allowedOrigins.join(', ')}`
  );
  return callback(new Error('Not allowed by CORS'));
},
```

#### Change 1D: Added Global Preflight Handler (Line 59-60)
**Before:**
```javascript
app.use(cors(corsOptions));
app.use(morgan('dev'));
```

**After:**
```javascript
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight handler for all routes
app.use(morgan('dev'));
```

**Why**: Browser sends OPTIONS request before POST/PUT/DELETE to check if CORS is allowed. Without this, OPTIONS fails and browser blocks the actual request.

#### Change 1E: Better Startup Logging (Line 130-140)
**Before:**
```javascript
console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
console.log(`✅ API Base URL: http://localhost:${port}/api`);
console.log(`✅ Recommended frontend VITE_API_URL: http://localhost:${port}/api`);
console.log(`✅ Allowed CORS origins: ${allowedOrigins.join(', ')}`);
console.log(`✅ Database Status: ${dbConnected ? '🟢 Connected' : '🟡 Connecting/Failed'}`);
```

**After:**
```javascript
console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
console.log(`✅ API Base URL: http://localhost:${port}/api`);
console.log(`✅ Allowed CORS origins (${allowedOrigins.length}):`);
allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
console.log(`✅ Database Status: ${dbConnected ? '🟢 Connected' : '🟡 Connecting/Failed'}`);
console.log(`\n📝 For Render production:`);
console.log(`   Set CLIENT_URLS env var to your frontend origin.`);
console.log(`   Set VITE_API_URL in frontend to this API's URL.`);
```

---

### 2. frontend/src/api/axiosClient.js

**No changes needed** - Already configured correctly:
```javascript
const API_URL = import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:5000/api' : '/api');
```

✅ Checks for `VITE_API_URL` env var first
✅ Falls back to localhost for dev
✅ Falls back to `/api` for production (when frontend & backend share same origin)
✅ Logs warning when `VITE_API_URL` missing in production

---

### 3. Authentication Flow (No Changes Needed)

#### Auth Middleware (backend/middleware/authMiddleware.js)
✅ Already properly validates `Authorization: Bearer <token>` header
✅ Already extracts and verifies JWT
✅ Already handles missing/invalid tokens

#### Auth Controller (backend/controllers/authController.js)
✅ Already returns JWT token in login/register response
✅ Already formats response correctly

#### Token Generation (backend/utils/generateToken.js)
✅ Already uses `JWT_SECRET` env var
✅ Already uses `JWT_EXPIRES_IN` env var

---

## Environment Variables Required

### Backend (Render Service)

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@mediconnect.com
ADMIN_PASSWORD=Admin123!
CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com
```

**Critical**: `CLIENT_URLS` must match your exact Render frontend service URL.

### Frontend (Render Service)

```bash
VITE_API_URL=https://mediconnect-backend.onrender.com/api
```

**Critical**: `VITE_API_URL` must match your exact Render backend service URL.

---

## How the Fix Works

### Before (Broken)
```
1. Browser sends OPTIONS preflight → No handler → 500 error
2. Browser sees error → Blocks POST request
3. User sees "Network Error"
```

### After (Fixed)
```
1. Browser sends OPTIONS preflight → app.options('*', cors()) handles it → 200 OK
2. Browser allows POST request → CORS check passes (origin in allowedOrigins)
3. POST request succeeds → User logs in
4. Response includes JWT token → Stored in localStorage
5. All future requests include token in Authorization header
```

---

## Verification Steps

### 1. Check Backend Logs Start Correctly
```
✅ Server running in production mode on port 5000
✅ API Base URL: http://localhost:5000/api
✅ Allowed CORS origins (3):
   - http://localhost:5173
   - http://127.0.0.1:5173
   - https://mediconnect-frontend-1l1z.onrender.com
✅ Database Status: 🟢 Connected

📝 For Render production:
   Set CLIENT_URLS env var to your frontend origin.
   Set VITE_API_URL in frontend to this API's URL.
```

### 2. Check Frontend Console Shows Correct API URL
```
🌐 API Base URL: https://mediconnect-backend.onrender.com/api
```

### 3. Test Login Flow
```
Frontend                        Backend
─────────────────────────────────────────────
1. User clicks "Login"
2. Browser sends OPTIONS /api/auth/login
                            ↓
                            app.options('*', cors())
                            Check CORS
                            Return 200 ✅
                            ↓
3. Browser sends POST /api/auth/login
                            ↓
                            cors() middleware
                            Check origin in allowedOrigins
                            Origin found ✅
                            ↓
                            authController.login()
                            Check credentials
                            Generate JWT ✅
                            Return user + token
                            ↓
4. Frontend stores token in localStorage
5. Frontend redirects to dashboard
6. All future requests include Authorization header
```

### 4. Check Backend Login Success Logs
```
🔐 [LOGIN] Received request: { email: 'test@example.com' }
✅ [LOGIN] Success: { userId: 507f1f77bcf86cd799439011, email: 'test@example.com', role: 'patient' }
```

### 5. Check No CORS Errors in Backend
```
❌ [CORS] Request blocked from origin: ... should NOT appear
⚠️ [CORS] No CLIENT_URL or CLIENT_URLS defined should NOT appear in production
```

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `backend/server.js` | Added `app.options('*', cors())` | Handles OPTIONS preflight requests |
| `backend/server.js` | Added default origins for localhost variants | Dev/local testing support |
| `backend/server.js` | Better CORS error logging | Easier debugging |
| `backend/server.js` | Better startup guidance | Users know to set env vars |
| **No changes** | `frontend/src/api/axiosClient.js` | Already correct |
| **No changes** | `backend/middleware/authMiddleware.js` | Already correct |
| **No changes** | `backend/controllers/authController.js` | Already correct |

---

## Deploy Steps

1. ✅ Set `CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com` in backend Render env
2. ✅ Set `VITE_API_URL=https://mediconnect-backend.onrender.com/api` in frontend Render env (CRITICAL: replace with your actual service names)
3. ✅ Redeploy backend
4. ✅ Redeploy frontend
5. ✅ Test login on production URL
6. ✅ Verify no CORS errors in browser console or backend logs
