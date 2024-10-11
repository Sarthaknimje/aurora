const express = require('express');
const router = express.Router();
const Bet = require('../models/Bet');
const Event = require('../models/Event');

router.post('/', async (req, res) => {
  try {
    const { eventId, userId, amount, prediction } = req.body;
    const newBet = new Bet({ eventId, userId, amount, prediction });
    await newBet.save();

    // Update event statistics
    await Event.findByIdAndUpdate(eventId, {
      $inc: { 
        volume: amount,
        [`${prediction ? 'yes' : 'no'}Percentage`]: amount
      }
    });

    res.status(201).json(newBet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.params.userId }).populate('eventId');
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;