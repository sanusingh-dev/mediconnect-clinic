# Mediconnect Clinic Management System

This repository contains a real-world clinic management web application with a React + Tailwind frontend and a Node.js + Express backend using MongoDB.

## Folder structure

- `backend/` - Express API server
- `frontend/` - Vite + React app

## Installation steps

### Backend
1. Open terminal in `backend/`
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Set `MONGO_URI`, `JWT_SECRET`, and `JWT_EXPIRES_IN`
5. Run `npm run dev`

### Frontend
1. Open terminal in `frontend/`
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Run `npm run dev`

## Required packages

### Backend
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- morgan
- express-async-handler
- nodemon (dev)

### Frontend
- react
- react-dom
- react-router-dom
- axios
- react-toastify
- react-icons
- vite
- @vitejs/plugin-react
- tailwindcss
- postcss
- autoprefixer

## Deployment

- Frontend can deploy on Vercel with the `frontend/` directory.
- Backend can deploy on Render or Railway with the `backend/` directory.
- Set environment variables for MongoDB and JWT secrets in the hosting provider.
