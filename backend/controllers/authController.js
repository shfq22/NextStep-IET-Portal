const User = require('../models/User');

async function signup(req, res) {
  try {
    const { role = 'student', name, email, rollNo, password, department } = req.body;
    if (!name || !password || (!email && !rollNo)) {
      return res.status(400).json({ error: 'Name, password, and email or rollNo are required' });
    }

    const duplicated = await User.findOne({ $or: [{ email }, { rollNo }] }).lean();
    if (duplicated) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await User.create({ role, name, email: email || '', rollNo: rollNo || '', password, department });
    const safe = { id: user._id.toString(), role: user.role, name: user.name, email: user.email, rollNo: user.rollNo, department: user.department };
    return res.status(201).json({ user: safe });
  } catch (error) {
    console.error('Signup error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { role, email, rollNo, password } = req.body;
    if (!password || (!email && !rollNo)) {
      return res.status(400).json({ error: 'Email or rollNo and password are required' });
    }

    const query = { role };
    if (rollNo) query.rollNo = rollNo;
    if (email) query.email = email;
    const user = await User.findOne(query).lean();
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const safe = { id: user._id.toString(), role: user.role, name: user.name, email: user.email, rollNo: user.rollNo, department: user.department };
    return res.json({ user: safe });
  } catch (error) {
    console.error('Login error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  signup,
  login,
};