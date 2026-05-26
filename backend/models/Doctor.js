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
