const mongoose = require('mongoose');

const gameRecordSchema = new mongoose.Schema({
  gameType: { type: String, enum: ['snake', 'tictactoe', '2048'], required: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GameRecord', gameRecordSchema);