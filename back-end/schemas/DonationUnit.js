const mongoose = require('mongoose');

const DonationUnitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  unitPhotoUrl: { type: String },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

module.exports = mongoose.model('DonationUnit', DonationUnitSchema);