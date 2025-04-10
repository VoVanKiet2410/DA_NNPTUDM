const mongoose = require('mongoose');

const HealthcheckSchema = new mongoose.Schema({
  healthMetrics: { type: String, required: true }, // JSON string
  notes: { type: String },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  result: {
    type: String,
    enum: ['PASS', 'FAIL'],
  },
});

module.exports = mongoose.model('Healthcheck', HealthcheckSchema);