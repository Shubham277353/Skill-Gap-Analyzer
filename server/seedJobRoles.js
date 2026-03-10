require('dotenv').config();
const mongoose = require('mongoose');
const JobRole = require('./models/JobRole');

const jobRoles = [
  {
    title: 'Frontend Developer',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Responsive Design'],
    description: 'Build user interfaces and client-side applications'
  },
  {
    title: 'Backend Developer',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Authentication', 'Database Design'],
    description: 'Build server-side applications and APIs'
  },
  {
    title: 'Full Stack Developer',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'REST API'],
    description: 'Build complete web applications'
  },
  {
    title: 'DevOps Engineer',
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git'],
    description: 'Manage infrastructure and deployment pipelines'
  },
  {
    title: 'Cybersecurity Specialist',
    requiredSkills: ['Network Security', 'Penetration Testing', 'Cryptography', 'SIEM Tools', 'Incident Response', 'Ethical Hacking'],
    description: 'Protect systems and networks from cyber threats'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await JobRole.deleteMany({});
    await JobRole.insertMany(jobRoles);
    console.log('Job roles seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
