const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Open', 'In Progress', 'Closed', 'Resolved'], default: 'Open' },
    reply: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);
