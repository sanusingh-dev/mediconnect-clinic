const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

let dbConnected = false;
(async () => {
  dbConnected = await connectDB();
})();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration - Allow frontend to access API from local and production clients
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
];

const configuredOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

if (process.env.NODE_ENV === 'production' && configuredOrigins.length === 0) {
  console.warn(
    '⚠️ [CORS] No CLIENT_URL or CLIENT_URLS defined in production.\n' +
    '   Set environment variable CLIENT_URLS to your deployed frontend origin(s).\n' +
    '   Example: CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com\n' +
    '   For multiple origins: CLIENT_URLS=https://mediconnect-frontend-1l1z.onrender.com,https://yourdomain.com'
  );
}

const corsOptions = {
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight handler for all routes
app.use(morgan('dev'));

const seedAdminUser = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mediconnect.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!existingAdmin) {
    const password = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: 'Admin', email: adminEmail, password, role: 'admin' });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  }
};

seedAdminUser().catch((error) => console.error('Admin seed error:', error));

app.get('/', (req, res) => {
  console.log('📡 [API] Health check requested');
  res.json({
    message: 'Clinic Management System API is running',
    status: 'ok',
    database: dbConnected ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: dbConnected ? 'connected' : 'connecting',
    apiVersion: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;

let server;
const MAX_PORT_TRIES = 10;

const startServer = (port = DEFAULT_PORT, tries = MAX_PORT_TRIES) => {
  if (tries <= 0) {
    console.error(`🚫 Unable to bind to a port after ${MAX_PORT_TRIES} attempts. Exiting.`);
    process.exit(1);
  }

  server = app
    .listen(port)
    .on('listening', () => {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
      console.log(`✅ API Base URL: http://localhost:${port}/api`);
      console.log(`✅ Allowed CORS origins (${allowedOrigins.length}):`);
      allowedOrigins.forEach((origin) => console.log(`   - ${origin}`));
      console.log(`✅ Database Status: ${dbConnected ? '🟢 Connected' : '🟡 Connecting/Failed'}`);
      console.log(`\n📝 For Render production:`);
      console.log(`   Set CLIENT_URLS env var to your frontend origin.`);
      console.log(`   Set VITE_API_URL in frontend to this API's URL.`);
      console.log(`${'='.repeat(70)}\n`);
    })
    .on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is already in use. Trying port ${port + 1}... (${tries - 1} tries left)`);
        // try next port
        setTimeout(() => startServer(port + 1, tries - 1), 200);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
};

startServer();

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`📋 ${signal} signal received: closing HTTP server`);
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
