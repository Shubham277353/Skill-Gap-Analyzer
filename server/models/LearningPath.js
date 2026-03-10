const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetRole: String,
  missingSkills: mongoose.Schema.Types.Mixed,
  roadmap: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
