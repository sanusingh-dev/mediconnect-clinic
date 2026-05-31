const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    specialty: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    photo: { type: String, trim: true },
    fees: { type: Number, default: 500 },
    consultationFee: { type: Number, default: 300 },
    upiId: { type: String, trim: true, default: '' },
    qrImage: { type: String, trim: true, default: '' },
    availableSlots: [
      {
        day: { type: String, required: true },
        slots: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
