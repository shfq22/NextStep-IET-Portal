const Student = require('../models/Student');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

async function getAllStudents(req, res) {
  try {
    const students = await Student.find().populate('user', 'name email rollNo department');
    return res.json(students);
  } catch (error) {
    console.error('getAllStudents error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email rollNo department');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.json(student);
  } catch (error) {
    console.error('getStudentById error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function createStudent(req, res) {
  try {
    const { name, rollNo, email, department, password } = req.body;
    if (!name || !rollNo || !password) return res.status(400).json({ error: 'Missing fields' });

    let user = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (!user) {
      user = await User.create({ role: 'student', name, email: email || '', rollNo, password, department });
    }

    const existing = await Student.findOne({ rollNo });
    if (existing) return res.status(409).json({ error: 'Student already exists' });

    const student = await Student.create({ user: user._id, rollNo, department });
    return res.status(201).json(student);
  } catch (error) {
    console.error('createStudent error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function getStudentGrievances(req, res) {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const grievances = await Ticket.find({ student: student._id });
    return res.json(grievances);
  } catch (error) {
    console.error('getStudentGrievances error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addStudentGrievance(req, res) {
  try {
    const studentId = req.params.id;
    const { title, description, category } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Missing fields' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const ticket = await Ticket.create({ student: student._id, subject: title, description, category: category || 'General' });
    student.grievances.push(ticket._id);
    await student.save();
    return res.status(201).json(ticket);
  } catch (error) {
    console.error('addStudentGrievance error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  getStudentGrievances,
  addStudentGrievance,
};