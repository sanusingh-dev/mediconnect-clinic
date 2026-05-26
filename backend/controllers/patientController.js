const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }
  res.json(patient);
});

const updatePatientProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  const user = await patient.populate('user');

  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  patient.phone = req.body.phone || patient.phone;
  patient.age = req.body.age || patient.age;
  patient.gender = req.body.gender || patient.gender;
  patient.address = req.body.address || patient.address;
  await patient.save();

  user.user.name = req.body.name || user.user.name;
  await user.user.save();

  res.json({ patient, user: user.user });
});

const uploadReport = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const report = {
    filename: req.body.filename || 'Report File',
    url: req.body.url || '',
  };

  patient.reports.push(report);
  await patient.save();

  res.status(201).json(patient.reports);
});

const getPatientAppointments = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const appointments = await Appointment.find({ patient: patient._id })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .sort({ appointmentDate: -1 });

  res.json(appointments);
});

const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const prescriptions = await Prescription.find({ patient: patient._id })
    .populate('doctor', 'specialty')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .sort({ createdAt: -1 });

  res.json(prescriptions);
});

module.exports = {
  getPatientProfile,
  updatePatientProfile,
  uploadReport,
  getPatientAppointments,
  getPatientPrescriptions,
};
