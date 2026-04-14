const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, default: 'Administration' },
    permissions: [{ type: String }], // e.g., 'manage_grievances', 'manage_scholarships', 'manage_announcements'
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
