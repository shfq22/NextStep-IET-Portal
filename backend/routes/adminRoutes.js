const express = require('express');
const router = express.Router();
const announcements = [];

router.get('/announcements', (req, res) => res.json(announcements));
router.post('/announcements', (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Missing fields' });
  const announcement = { id: Date.now().toString(), title, message, createdAt: new Date() };
  announcements.push(announcement);
  return res.status(201).json(announcement);
});

module.exports = router;
