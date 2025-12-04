const mongoose = require('mongoose');

const serialLogSchema = new mongoose.Schema({
  port: { type: String, required: true },
  action: { type: String, enum: ['connect', 'disconnect', 'send', 'receive'], required: true },
  data: { type: String },
  response: { type: String },
  status: { type: String, enum: ['success', 'failed'], required: true },
  error: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SerialLog', serialLogSchema);