const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 12,
    maxlength: 12,
  },
  password: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo',
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
  ],
  bloodDonationHistories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodDonationHistory',
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);