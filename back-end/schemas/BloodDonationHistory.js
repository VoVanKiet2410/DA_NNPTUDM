const mongoose = require('mongoose');

const BloodDonationHistorySchema = new mongoose.Schema({
  donationDateTime: { type: Date, required: true },
  bloodAmount: { type: Number, required: true },
  donationLocation: { type: String, required: true },
  notes: { type: String },
  donationType: { type: String },
  reactionAfterDonation: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
});

module.exports = mongoose.model('BloodDonationHistory', BloodDonationHistorySchema);