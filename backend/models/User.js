const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    name: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    rollNo: { type: String, trim: true },
    password: { type: String, required: true },
    department: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ rollNo: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
