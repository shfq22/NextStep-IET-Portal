const Placement = require('../models/Placement');

async function getPlacements(req, res) {
  try {
    const placements = await Placement.find().sort({ postedAt: -1 });
    return res.json(placements);
  } catch (error) {
    console.error('getPlacements error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function addPlacement(req, res) {
  try {
    const { company, position, type, postedBy } = req.body;
    if (!company || !position) return res.status(400).json({ error: 'Missing fields' });

    const placement = await Placement.create({ company, position, type: type || 'on-campus', postedBy: postedBy || 'Admin' });
    return res.status(201).json(placement);
  } catch (error) {
    console.error('addPlacement error', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  getPlacements,
  addPlacement,
};