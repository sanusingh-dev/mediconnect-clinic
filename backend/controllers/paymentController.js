const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Get doctor's pending payment requests
const getPendingPaymentRequests = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const payments = await Payment.find({ doctorId: doctor._id })
    .populate({ path: 'patientId', populate: { path: 'user', select: 'name' } })
    .populate({ path: 'userId', select: 'name email' })
    .populate('appointmentId')
    .sort({ createdAt: -1 });

  res.json(payments);
});

// Upload payment proof
const uploadPaymentProof = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { paymentProofUrl } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  let payment = await Payment.findOne({ appointmentId });

  if (!payment) {
    const doctor = await Doctor.findById(appointment.doctorId);
    const patient = await Patient.findById(appointment.patient);

    payment = await Payment.create({
      appointmentId,
      patientId: appointment.patient,
      doctorId: appointment.doctorId,
      userId: appointment.userId,
      amount: doctor.consultationFee,
      upiId: doctor.upiId,
      paymentProofUrl,
      paymentStatus: 'proof_uploaded',
    });
  } else {
    payment.paymentProofUrl = paymentProofUrl;
    payment.paymentStatus = 'proof_uploaded';
    await payment.save();
  }

  appointment.paymentStatus = 'proof_uploaded';
  appointment.paymentId = payment._id;
  await appointment.save();

  res.status(201).json(payment);
});

// Confirm payment and generate token
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Generate token number
  const tokenNumber = Math.floor(Math.random() * 10000) + 1;

  payment.paymentStatus = 'confirmed';
  payment.tokenNumber = tokenNumber;
  payment.tokenStatus = 'confirmed';
  payment.confirmedAt = new Date();
  await payment.save();

  const appointment = await Appointment.findById(payment.appointmentId);
  appointment.paymentStatus = 'confirmed';
  appointment.tokenNumber = tokenNumber;
  appointment.status = 'confirmed';
  await appointment.save();

  res.json({
    payment,
    message: 'Payment confirmed and token generated',
    tokenNumber,
  });
});

// Reject payment
const rejectPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { rejectionReason } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  payment.paymentStatus = 'rejected';
  payment.paymentRejectionReason = rejectionReason || '';
  payment.rejectedAt = new Date();
  await payment.save();

  const appointment = await Appointment.findById(payment.appointmentId);
  appointment.paymentStatus = 'rejected';
  await appointment.save();

  res.json({ payment, message: 'Payment rejected' });
});

// Get payment details
const getPaymentDetails = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const payment = await Payment.findOne({ appointmentId })
    .populate({ path: 'patientId', populate: { path: 'user', select: 'name' } })
    .populate({ path: 'doctorId', populate: { path: 'user', select: 'name' } })
    .populate('appointmentId');

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  res.json(payment);
});

// Get patient payment history
const getPatientPaymentHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  const payments = await Payment.find({ patientId: patient._id })
    .populate({ path: 'doctorId', populate: { path: 'user', select: 'name' } })
    .populate('appointmentId')
    .sort({ createdAt: -1 });

  res.json(payments);
});

module.exports = {
  getPendingPaymentRequests,
  uploadPaymentProof,
  confirmPayment,
  rejectPayment,
  getPaymentDetails,
  getPatientPaymentHistory,
};
