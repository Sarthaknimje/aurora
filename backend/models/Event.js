const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  yesPercentage: { type: Number, default: 0 },
  noPercentage: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  liquidity: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isFinalized: { type: Boolean, default: false },
  result: { type: Boolean, default: null },
  claimPeriodEnd: { type: Date }
});

module.exports = mongoose.model('Event', EventSchema);