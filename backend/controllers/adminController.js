const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

const getAnalytics = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();
  const doctors = await User.countDocuments({ role: 'doctor' });
  const patients = await User.countDocuments({ role: 'patient' });
  const appointments = await Appointment.countDocuments();
  const completed = await Appointment.countDocuments({ status: 'completed' });
  const revenueEstimate = completed * 120;

  res.json({ users, doctors, patients, appointments, completed, revenueEstimate });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.limit) || 10;
  const skip = (page - 1) * pageSize;
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: 'i' },
      }
    : {};

  const total = await User.countDocuments(keyword);
  const users = await User.find(keyword)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  res.json({ users, page, pages: Math.ceil(total / pageSize) });
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate('user', 'name email');
  res.json(doctors);
});

const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
    .sort({ appointmentDate: -1 });
  res.json(appointments);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.remove();
  res.json({ message: 'User removed' });
});

module.exports = {
  getAnalytics,
  getAllUsers,
  getAllDoctors,
  getAllAppointments,
  deleteUser,
};
