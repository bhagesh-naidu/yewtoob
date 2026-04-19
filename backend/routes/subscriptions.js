// routes/subscriptions.js — Subscription routing
const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/subscriptions/my-subscriptions ───────────────────
router.get('/my-subscriptions', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ subscriber: req.user._id })
      .populate('channel', 'username avatar subscriberCount');
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/subscriptions/channels/:channelId/status ─────────
router.get('/channels/:channelId/status', protect, async (req, res) => {
  try {
    const isSubscribed = await Subscription.exists({
      subscriber: req.user._id,
      channel: req.params.channelId,
    });
    res.json({ isSubscribed: !!isSubscribed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/subscriptions/subscribe ─────────────────────────
router.post('/subscribe', protect, async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) return res.status(400).json({ message: 'channelId is required' });
  if (channelId === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot subscribe to yourself' });
  }

  try {
    const existing = await Subscription.findOne({ subscriber: req.user._id, channel: channelId });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    await Subscription.create({ subscriber: req.user._id, channel: channelId });
    await User.findByIdAndUpdate(channelId, { $inc: { subscriberCount: 1 } });
    
    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/subscriptions/unsubscribe/:channelId ──────────
router.delete('/unsubscribe/:channelId', protect, async (req, res) => {
  try {
    const deleted = await Subscription.findOneAndDelete({
      subscriber: req.user._id,
      channel: req.params.channelId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await User.findByIdAndUpdate(req.params.channelId, { $inc: { subscriberCount: -1 } });
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
