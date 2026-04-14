const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    target: { type: String, default: 'All' },
    postedBy: { type: String, default: 'Admin' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
