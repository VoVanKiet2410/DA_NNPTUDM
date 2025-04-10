const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiryDate: { type: Date, required: true },
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);