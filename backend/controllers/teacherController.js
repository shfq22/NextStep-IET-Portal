const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function getAllTeachers(req, res) {
  try {
    const teachers = await Teacher.find().populate('user', 'name email department');
    return res.json(teachers);
  } catch (error) {
    console.error('getAllTeachers error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createTeacher(req, res) {
  try {
    const { name, email, department, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ role: 'teacher', name, email, password, department });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Teacher already exists' });

    const teacher = await Teacher.create({ user: user._id, email, department });
    return res.status(201).json(teacher);
  } catch (error) {
    console.error('createTeacher error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getAllTeachers,
  createTeacher,
};