// routes/comments.js — Comment CRUD routes
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// ── GET /api/comments?videoId=xxx ─────────────────────────────
router.get('/', async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) return res.status(400).json({ message: 'videoId is required' });

  try {
    const comments = await Comment.find({ video: videoId })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/comments ────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  const { videoId, text } = req.body;

  if (!videoId || !text) {
    return res.status(400).json({ message: 'videoId and text are required' });
  }

  try {
    const comment = await Comment.create({
      video: videoId,
      author: req.user._id,
      authorName: req.user.username,
      text,
    });
    // populate for immediate display
    await comment.populate('author', 'username avatar');
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/comments/:id ──────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/comments/:id/like ──────────────────────────────
router.patch('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
