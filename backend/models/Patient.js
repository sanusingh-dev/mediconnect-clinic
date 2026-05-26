const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    phone: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    address: { type: String, trim: true },
    reports: [
      {
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
