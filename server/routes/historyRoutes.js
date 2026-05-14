const express = require('express');
const router = express.Router();
const LearningPath = require('../models/LearningPath');
const auth = require('../middleware/auth');

// Get all analyses for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const history = await LearningPath.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('targetRole matchScore careerLevel createdAt roadmap missingSkills');
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
