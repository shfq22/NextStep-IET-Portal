const express = require('express');
const router = express.Router();
const students = [];

router.get('/', (req, res) => res.json(students));
router.get('/:id', (req, res) => {
  const student = students.find((x) => x.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  return res.json(student);
});

router.post('/', (req, res) => {
  const { name, rollNo, email } = req.body;
  if (!name || !rollNo) return res.status(400).json({ error: 'Missing fields' });
  const student = { id: Date.now().toString(), name, rollNo, email: email || '', grievances: [] };
  students.push(student);
  return res.status(201).json(student);
});

router.get('/grievances', (req, res) => {
  const allGrievances = students.flatMap((s) => (s.grievances || []).map((g) => ({ studentId: s.id, studentName: s.name, ...g })));
  return res.json(allGrievances);
});

router.post('/grievances', (req, res) => {
  const { studentId, title, description } = req.body;
  if (!studentId || !title || !description) return res.status(400).json({ error: 'Missing fields' });
  const student = students.find((x) => x.id === studentId);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const grievance = { id: Date.now().toString(), title, description, status: 'open', createdAt: new Date().toISOString() };
  student.grievances.push(grievance);
  return res.status(201).json(grievance);
});

router.get('/:id/grievances', (req, res) => {
  const student = students.find((x) => x.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  return res.json(student.grievances || []);
});

router.post('/:id/grievances', (req, res) => {
  const student = students.find((x) => x.id === req.params.id);
  if (!student) return res.status(404).json({ error: 'Not found' });
  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Missing fields' });
  const grievance = { id: Date.now().toString(), title, description, status: 'open', createdAt: new Date() };
  student.grievances.push(grievance);
  return res.status(201).json(grievance);
});

module.exports = router;
