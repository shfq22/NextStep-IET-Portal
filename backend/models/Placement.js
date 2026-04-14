const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    position: { type: String, required: true },
    type: { type: String, enum: ['on-campus', 'off-campus'], default: 'on-campus' },
    postedBy: { type: String },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Placement', placementSchema);
