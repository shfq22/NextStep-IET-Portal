const Announcement = require('../models/Announcement');

async function getAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find({ status: 'active' }).sort({ createdAt: -1 });
    return res.json(announcements);
  } catch (error) {
    console.error('getAnnouncements error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addAnnouncement(req, res) {
  try {
    const { title, body, target, postedBy } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Missing fields' });

    const announcement = await Announcement.create({ title, body, target: target || 'All', postedBy: postedBy || 'Admin' });
    return res.status(201).json(announcement);
  } catch (error) {
    console.error('addAnnouncement error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getAnnouncements,
  addAnnouncement,
};