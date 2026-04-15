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
  },
  {
    title: 'Data Scientist',
    requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy', 'Data Visualization', 'SQL'],
    description: 'Analyze complex data to drive business decisions'
  },
  {
    title: 'Machine Learning Engineer',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP', 'Model Deployment', 'MLOps'],
    description: 'Build and deploy machine learning models at scale'
  },
  {
    title: 'Cloud Architect',
    requiredSkills: ['AWS', 'Azure', 'Google Cloud', 'Terraform', 'Microservices', 'Serverless', 'Networking'],
    description: 'Design and manage scalable cloud infrastructure'
  },
  {
    title: 'Mobile Developer',
    requiredSkills: ['React Native', 'Flutter', 'iOS', 'Android', 'JavaScript', 'REST API', 'App Store Deployment'],
    description: 'Build cross-platform mobile applications'
  },
  {
    title: 'UI/UX Designer',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility', 'CSS'],
    description: 'Design intuitive and beautiful user experiences'
  },
  {
    title: 'Blockchain Developer',
    requiredSkills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'Cryptography', 'DeFi', 'JavaScript'],
    description: 'Build decentralized applications and smart contracts'
  },
  {
    title: 'Data Engineer',
    requiredSkills: ['Python', 'SQL', 'Apache Spark', 'ETL Pipelines', 'Data Warehousing', 'Kafka', 'Airflow'],
    description: 'Build and maintain data pipelines and infrastructure'
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
