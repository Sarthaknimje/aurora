const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  prediction: { type: Boolean, required: true },
  settled: { type: Boolean, default: false },
  claimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', BetSchema);