const express = require('express');
const router = express.Router();
const placements = [];

router.get('/', (req, res) => res.json(placements));
router.post('/', (req, res) => {
  const { company, position, type } = req.body;
  if (!company || !position) return res.status(400).json({ error: 'Missing fields' });
  const placement = { id: Date.now().toString(), company, position, type: type || 'on-campus', postedAt: new Date() };
  placements.push(placement);
  return res.status(201).json(placement);
});

module.exports = router;
