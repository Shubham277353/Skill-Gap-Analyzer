const express = require('express');
const router = express.Router();
const questionBank = require('../data/questionBank');

// GET questions for a role — strip answer, keep skill tag
router.get('/:role', (req, res) => {
  const role = decodeURIComponent(req.params.role);
  const questions = questionBank[role];
  if (!questions) return res.status(404).json({ error: 'No questions found for this role' });
  const sanitized = questions.map(({ question, options, skill }) => ({ question, options, skill }));
  res.json(sanitized);
});

// POST submit answers — returns score + skill-wise breakdown
router.post('/submit', (req, res) => {
  const { role, answers } = req.body;
  const questions = questionBank[role];
  if (!questions) return res.status(404).json({ error: 'Role not found' });

  let score = 0;
  const skillMap = {};   // { CSS: { correct: 2, total: 3 }, ... }
  const weakAreas = [];

  answers.forEach((userAnswer, i) => {
    const q = questions[i];
    if (!q) return;

    const skill = q.skill || 'General';
    if (!skillMap[skill]) skillMap[skill] = { correct: 0, total: 0 };
    skillMap[skill].total++;

    if (userAnswer === q.answer) {
      score++;
      skillMap[skill].correct++;
    } else {
      weakAreas.push(q.question);
    }
  });

  // Build skill breakdown with proficiency % and classification
  const skillBreakdown = {};
  Object.entries(skillMap).forEach(([skill, { correct, total }]) => {
    const proficiency = Math.round((correct / total) * 100);
    let level;
    if (proficiency >= 70) level = 'Strong';
    else if (proficiency >= 40) level = 'Moderate';
    else level = 'Weak';
    skillBreakdown[skill] = { correct, total, proficiency, level };
  });

  const percentage = Math.round((score / questions.length) * 100);
  let skillLevel = 'Beginner';
  if (percentage >= 80) skillLevel = 'Advanced';
  else if (percentage >= 50) skillLevel = 'Intermediate';

  res.json({ score, total: questions.length, percentage, skillLevel, weakAreas, skillBreakdown });
});

module.exports = router;
