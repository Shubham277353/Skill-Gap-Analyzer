require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jobRoleRoutes = require('./routes/jobRoleRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api', analysisRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Skill Gap Analysis API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
