const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Bet = require('../models/Bet');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
 
  const adminToken = req.headers['admin-token'];
  if (adminToken === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// Create a new event
router.post('/events', isAdmin, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all events for admin
router.get('/events', isAdmin, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Finalize an event and set the result
router.post('/events/:id/finalize', isAdmin, async (req, res) => {
  try {
    const { result } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        isFinalized: true, 
        result,
        claimPeriodEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process claims for a finalized event
router.post('/events/:id/process-claims', isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isFinalized) {
      return res.status(400).json({ message: 'Event not finalized' });
    }

    const bets = await Bet.find({ eventId: event._id, settled: false });
    const claimedBets = [];

    for (const bet of bets) {
      if (bet.prediction === event.result) {
        bet.settled = true;
        bet.claimed = true;
        await bet.save();
        claimedBets.push(bet);
      }
    }

    res.json({ message: 'Claims processed', claimedBets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;