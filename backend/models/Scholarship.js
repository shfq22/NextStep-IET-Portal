const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    deadlineDate: { type: Date },
    requiredDocuments: [{ type: String }], // Array of document types
    status: { type: String, enum: ['Open', 'Closed', 'Verification'], default: 'Open' },
    createdBy: { type: String }, // Admin name
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);
