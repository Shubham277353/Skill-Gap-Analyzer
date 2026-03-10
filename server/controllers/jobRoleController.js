const JobRole = require('../models/JobRole');

exports.getAllJobRoles = async (req, res) => {
  try {
    const jobRoles = await JobRole.find();
    res.json(jobRoles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createJobRole = async (req, res) => {
  try {
    const jobRole = new JobRole(req.body);
    await jobRole.save();
    res.status(201).json(jobRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
