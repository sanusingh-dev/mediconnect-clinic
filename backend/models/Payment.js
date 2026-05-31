const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true },
    upiId: { type: String, trim: true },
    paymentProofUrl: { type: String, trim: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'proof_uploaded', 'confirmed', 'rejected'],
      default: 'pending',
    },
    paymentRejectionReason: { type: String, trim: true, default: '' },
    confirmedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    tokenNumber: { type: Number, default: 0 },
    tokenStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
