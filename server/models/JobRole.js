const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  requiredSkills: [String],
  description: String
});

module.exports = mongoose.model('JobRole', jobRoleSchema, 'jobRoles');
