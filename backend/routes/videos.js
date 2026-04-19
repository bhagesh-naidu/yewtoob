// routes/videos.js — Video CRUD + search routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const { protect } = require('../middleware/auth');

// ── Multer setup for local video uploads ─────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'videos');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|webm|ogg|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext || mime) return cb(null, true);
    cb(new Error('Only video files are allowed'));
  },
});

// ── GET /api/videos — fetch all videos (newest first) ────────
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate('uploader', 'username avatar');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/videos/search?q=term ────────────────────────────
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const videos = await Video.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    })
      .sort({ views: -1 })
      .populate('uploader', 'username avatar');

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/videos/:id — single video ───────────────────────
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment view count
      { new: true }
    ).populate('uploader', 'username avatar');

    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/videos — create video (URL-based) ───────────────
router.post('/', protect, async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl, tags, category } = req.body;

  if (!title || !videoUrl) {
    return res.status(400).json({ message: 'Title and video URL are required' });
  }

  try {
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      category,
      uploader: req.user._id,
      uploaderName: req.user.username,
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/videos/upload — upload actual video file ────────
router.post('/upload', protect, upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const { title, description, thumbnailUrl, tags, category } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      category,
      uploader: req.user._id,
      uploaderName: req.user.username,
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/videos/:id/like ────────────────────────────────
router.patch('/:id/like', protect, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ likes: video.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/videos/:id ────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/videos/stream/:filename — Byte-range video streaming ──
router.get('/stream/:filename', (req, res) => {
  const filepath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ message: 'Video file not found' });
  }

  const stat = fs.statSync(filepath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filepath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4', // Defaulting to mp4 but you can map ext based on params
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filepath).pipe(res);
  }
});

module.exports = router;
