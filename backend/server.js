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
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
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
  res.json({ message: 'Clinic Management System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
