const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

const registerPatient = asyncHandler(async (req, res) => {
  console.log('📝 [PATIENT REGISTER] Received request:', { email: req.body.email, name: req.body.name });
  const { name, email, password, phone, age, gender, address } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('❌ [PATIENT REGISTER] Email already exists:', email);
    res.status(400);
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: 'patient' });

  if (!user) {
    console.log('❌ [PATIENT REGISTER] Failed to create user');
    res.status(400);
    throw new Error('Unable to create patient user');
  }

  await Patient.create({ user: user._id, phone, age, gender, address });
  console.log('✅ [PATIENT REGISTER] Success:', { userId: user._id, email: user.email });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const registerDoctor = asyncHandler(async (req, res) => {
  console.log('📝 [DOCTOR REGISTER] Received request:', { email: req.body.email, name: req.body.name });
  const {
    name,
    email,
    password,
    specialty,
    bio,
    phone,
    location,
    availableSlots,
    consultationFee,
    upiId,
    qrImage,
  } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    console.log('❌ [DOCTOR REGISTER] Email already exists:', email);
    res.status(400);
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role: 'doctor' });

  if (!user) {
    console.log('❌ [DOCTOR REGISTER] Failed to create user');
    res.status(400);
    throw new Error('Unable to create doctor user');
  }

  await Doctor.create({
    user: user._id,
    specialty,
    bio,
    phone,
    location,
    availableSlots,
    consultationFee: consultationFee || 300,
    upiId: upiId || '',
    qrImage: qrImage || '',
  });
  console.log('✅ [DOCTOR REGISTER] Success:', { userId: user._id, email: user.email });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const login = asyncHandler(async (req, res) => {
  console.log('🔐 [LOGIN] Received request:', { email: req.body.email });
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log('❌ [LOGIN] User not found:', email);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    console.log('❌ [LOGIN] Invalid password for:', email);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  console.log('✅ [LOGIN] Success:', { userId: user._id, email: user.email, role: user.role });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  getCurrentUser,
};
