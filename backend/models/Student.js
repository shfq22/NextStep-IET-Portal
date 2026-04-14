const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rollNo: { type: String, required: true, unique: true },
    department: { type: String },
    grievances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
