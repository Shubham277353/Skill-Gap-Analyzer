const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const upload = require('../config/multer');

router.post('/analyze', upload.single('resume'), analysisController.analyzeSkills);
router.get('/learning-path/:id', analysisController.getLearningPath);

module.exports = router;
