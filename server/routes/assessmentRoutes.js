const express = require('express');
const router = express.Router();
const questionBank = require('../data/questionBank');

// GET questions for a role
router.get('/:role', (req, res) => {
  const role = decodeURIComponent(req.params.role);
  const questions = questionBank[role];
  if (!questions) return res.status(404).json({ error: 'No questions found for this role' });
  // Return questions without the answer field
  const sanitized = questions.map(({ question, options }) => ({ question, options }));
  res.json(sanitized);
});

// POST submit answers and get score
router.post('/submit', (req, res) => {
  const { role, answers } = req.body;
  const questions = questionBank[role];
  if (!questions) return res.status(404).json({ error: 'Role not found' });

  let score = 0;
  const weakAreas = [];

  answers.forEach((userAnswer, i) => {
    if (questions[i] && userAnswer === questions[i].answer) {
      score++;
    } else if (questions[i]) {
      weakAreas.push(questions[i].question);
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  let skillLevel = 'Beginner';
  if (percentage >= 80) skillLevel = 'Advanced';
  else if (percentage >= 50) skillLevel = 'Intermediate';

  res.json({ score, total: questions.length, percentage, skillLevel, weakAreas });
});

module.exports = router;
