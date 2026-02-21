const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: String,
  message: String,
  type: String
}, { timestamps: true });

module.exports = mongoose.model('Notification', schema);