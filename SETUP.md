# Mediconnect Clinic Management System - Setup Guide

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)

## Backend Setup

### 1. MongoDB Atlas Connection

**Step 1: Create a MongoDB Atlas Account**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for a free account
- Create a new project

**Step 2: Create a Cluster**
- Click "Create" to create a new cluster
- Select "Free" tier
- Choose your preferred cloud provider and region
- Wait for cluster to deploy

**Step 3: Configure Network Access**
- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (for development)
- **For production:** Add your specific server IP addresses

**Step 4: Get Connection String**
- Go to "Databases" > Your Cluster > "Connect"
- Select "Drivers" > "Node.js"
- Copy the connection string
- Replace `<username>` and `<password>` with your database credentials

### 2. Backend Configuration

```bash
cd backend

# Create .env file from template
cp .env.example .env

# Edit .env and add your MongoDB URI
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

**Important Fields in `.env`:**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start Backend

```bash
npm install
npm run dev
```

**Expected Output:**
```
============================================================
✅ Server running in development mode on port 5000
✅ API Base URL: http://localhost:5000/api
✅ CORS Origin: http://localhost:5173
✅ Database Status: 🟢 Connected
============================================================
```

## Frontend Setup

### 1. Frontend Configuration

```bash
cd frontend

# Create .env file
cp .env.example .env

# Verify API URL points to backend
# VITE_API_URL=http://localhost:5000/api
```

### 2. Start Frontend

```bash
npm install
npm run dev
```

**Frontend will be available at:** http://localhost:5173

## Troubleshooting

### Database Connection Timeout (ETIMEDOUT)

**Cause:** Cannot reach MongoDB Atlas server

**Solutions:**
1. **Check Network Access:**
   - Go to MongoDB Atlas > Network Access
   - Ensure your IP is whitelisted
   - Use "Allow Access from Anywhere" for development

2. **Check Connection String:**
   - Verify username and password are correct
   - Ensure no special characters are URL-encoded incorrectly
   - Check cluster name matches

3. **Verify Internet Connection:**
   - Ensure you can reach https://cluster0.xwnfjcw.mongodb.net

4. **Check Firewall:**
   - Port 27017 must be open for outbound traffic

### API Response Errors

**CORS errors:**
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Development: `http://localhost:5173`
- Production: Your deployed domain

**Authentication errors:**
- Check `JWT_SECRET` is set in `.env`
- Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)

### Admin User Not Created

**Manual Admin Creation:**
```javascript
// Run in Node REPL or create a script
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const password = await bcrypt.hash('Admin123!', 10);
await User.create({
  name: 'Admin',
  email: 'admin@mediconnect.com',
  password,
  role: 'admin'
});
```

## API Endpoints Health Check

### Test Backend Connection

```bash
# Health check endpoint
curl http://localhost:5000/api/health

# Should return:
# {
#   "status": "ok",
#   "database": "connected",
#   "apiVersion": "1.0.0",
#   "timestamp": "2026-05-29T10:30:00.000Z"
# }
```

## Production Deployment

### Backend

1. Update `.env` for production:
```
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
CLIENT_URL=https://yourdomain.com
JWT_SECRET=strong-random-secret-key
```

2. Build and deploy to hosting (Heroku, AWS, Render, etc.)

### Frontend

1. Update `.env` for production:
```
VITE_API_URL=https://api.yourdomain.com/api
```

2. Build:
```bash
npm run build
```

3. Deploy `dist/` folder to hosting

## Documentation

- **API Routes:** See backend route files in `/routes`
- **Models:** Database schemas in `/models`
- **Services:** API client methods in `frontend/src/services`

## Support

For issues or questions:
1. Check this setup guide
2. Review backend console logs for detailed errors
3. Verify all environment variables are set correctly
