const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const upload = require('../config/multer');
const auth = require('../middleware/auth');

router.post('/analyze', auth, upload.single('resume'), analysisController.analyzeSkills);
router.get('/learning-path/:id', analysisController.getLearningPath);

module.exports = router;
