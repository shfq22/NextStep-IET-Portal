const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
    documentType: { type: String, required: true }, // e.g., "Income Certificate", "Caste Certificate"
    fileName: { type: String, required: true },
    originalName: { type: String },
    fileSize: { type: Number }, // in bytes
    fileExtension: { type: String },
    uploadedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected', 'Reupload Requested'], default: 'Pending' },
    adminNote: { type: String }, // For rejection or reupload notes
    filePath: { type: String, required: true }, // Server path to file
    mimeType: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
