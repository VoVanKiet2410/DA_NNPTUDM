const mongoose = require('mongoose');

const UserInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  sex: { type: String, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.model('UserInfo', UserInfoSchema);