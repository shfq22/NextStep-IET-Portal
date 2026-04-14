const express = require('express');
const router = express.Router();

const users = [];

// LOGIN
router.post('/login', (req, res) => {
  const { role, email, rollNo, password } = req.body;

  if (!role || !password || (role === 'student' && !rollNo) || (role !== 'student' && !email)) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = users.find(
    (u) =>
      u.role === role &&
      ((role === 'student' && u.rollNo === rollNo) ||
        (role !== 'student' && u.email === email)) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ FIXED RESPONSE
  return res.json({
    user: {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
    },
  });
});


// SIGNUP
router.post('/signup', (req, res) => {
  const { role, name, email, rollNo, password } = req.body;

  if (!role || !name || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (users.some((u) => u.email === email || u.rollNo === rollNo)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: Date.now().toString(),
    role,
    name,
    email: email || '',
    rollNo: rollNo || '',
    password,
  };

  users.push(newUser);

  return res.status(201).json({
    user: {
      id: newUser.id,
      role: newUser.role,
      name: newUser.name,
      email: newUser.email,
      rollNo: newUser.rollNo,
    },
  });
});

module.exports = router;