const express = require('express');
const router = express.Router();
const teachers = [];

router.get('/', (req, res) => res.json(teachers));
router.post('/', (req, res) => {
  const { name, email } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing fields' });
  const teacher = { id: Date.now().toString(), name, email: email || '' };
  teachers.push(teacher);
  return res.status(201).json(teacher);
});

module.exports = router;
