const express = require('express');
const router = express.Router();
const jobRoleController = require('../controllers/jobRoleController');

router.get('/', jobRoleController.getAllJobRoles);
router.post('/', jobRoleController.createJobRole);

module.exports = router;
