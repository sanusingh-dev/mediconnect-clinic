const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }
  res.json(doctor);
});

const getAllDoctorsPublic = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find().populate('user', 'name email');
  res.json(doctors);
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  doctor.specialty = req.body.specialty || doctor.specialty;
  doctor.bio = req.body.bio || doctor.bio;
  doctor.phone = req.body.phone || doctor.phone;
  doctor.location = req.body.location || doctor.location;
  doctor.availableSlots = req.body.availableSlots || doctor.availableSlots;
  doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;
  doctor.upiId = req.body.upiId || doctor.upiId;
  doctor.qrImage = req.body.qrImage || doctor.qrImage;
  await doctor.save();

  if (req.body.name) {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    await user.save();
  }

  res.json(doctor);
});

const getTodayAppointments = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    doctor: doctor._id,
    appointmentDate: { $gte: start, $lte: end },
  })
    .populate({ path: 'patient', populate: { path: 'user', select: 'name' } })
    .sort({ appointmentDate: 1 });

  res.json(appointments);
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  appointment.status = req.body.status || appointment.status;
  appointment.notes = req.body.notes || appointment.notes;
  await appointment.save();
  res.json(appointment);
});

const writePrescription = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const patient = await Patient.findById(appointment.patient);
  if (!patient) {
    res.status(404);
    throw new Error('Patient does not exist');
  }

  const prescription = await Prescription.create({
    appointment: appointment._id,
    patient: patient._id,
    doctor: appointment.doctor,
    medicines: req.body.medicines || [],
    instructions: req.body.instructions || '',
    notes: req.body.notes || '',
  });

  appointment.status = 'completed';
  await appointment.save();

  res.status(201).json(prescription);
});

const getPatientHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.query.patientId || req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const appointments = await Appointment.find({ patient: patient._id })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
    .sort({ appointmentDate: -1 });

  const prescriptions = await Prescription.find({ patient: patient._id })
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

  res.json({ appointments, prescriptions });
});

module.exports = {
  getDoctorProfile,
  updateDoctorProfile,
  getTodayAppointments,
  updateAppointmentStatus,
  writePrescription,
  getPatientHistory,
  getAllDoctorsPublic,
};
