const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');

const getAvailableSlots = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }
  res.json(doctor.availableSlots || []);
});

const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, timeSlot } = req.body;
  const patient = await Patient.findOne({ user: req.user._id });
  const doctor = await Doctor.findById(doctorId);

  if (!patient || !doctor) {
    res.status(404);
    throw new Error('Patient or doctor profile missing');
  }

  const date = new Date(appointmentDate);

  const appointment = await Appointment.create({
    userId: req.user._id,
    patient: patient._id,
    doctorId: doctor._id,
    doctor: doctor._id,
    appointmentDate: date,
    appointmentTime: timeSlot,
    timeSlot,
    status: 'pending',
    paymentStatus: 'pending',
    createdBy: req.user._id,
  });

  res.status(201).json(appointment);
});

const getAppointmentDetails = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.json(appointment);
});

const getMyAppointments = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const filter = {};
  if (user.role === 'doctor') {
    const doctor = await Doctor.findOne({ user: req.user._id });
    filter.doctor = doctor._id;
  } else if (user.role === 'patient') {
    const patient = await Patient.findOne({ user: req.user._id });
    filter.patient = patient._id;
  }

  const appointments = await Appointment.find(filter)
    .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .sort({ appointmentDate: -1 });

  res.json(appointments);
});

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getAppointmentDetails,
  getMyAppointments,
};
