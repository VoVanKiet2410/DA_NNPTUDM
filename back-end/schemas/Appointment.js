const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  healthcheck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Healthcheck',
  },
  bloodInventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodInventory',
  },
  bloodDonationHistory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodDonationHistory',
  },
  appointmentDateTime: { type: Date, required: true },
  bloodAmount: { type: Number },
  nextDonationEligibleDate: { type: Date },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED'],
  },
});

module.exports = mongoose.model('Appointment', AppointmentSchema);