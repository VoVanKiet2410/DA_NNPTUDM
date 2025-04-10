const mongoose = require('mongoose');

const BloodInventorySchema = new mongoose.Schema({
  bloodType: { type: String, required: true },
  quantity: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
});

module.exports = mongoose.model('BloodInventory', BloodInventorySchema);