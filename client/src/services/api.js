import axios from 'axios';

const API_URL = 'https://skill-gap-analyzer-9l00.onrender.com/api';

export const getJobRoles = async () => {
  const response = await axios.get(`${API_URL}/job-roles`);
  return response.data;
};

export const getAssessmentQuestions = async (role) => {
  const response = await axios.get(`${API_URL}/assessment/${encodeURIComponent(role)}`);
  return response.data;
};

export const submitAssessment = async (role, answers) => {
  const response = await axios.post(`${API_URL}/assessment/submit`, { role, answers });
  return response.data;
};

export const analyzeSkills = async (data) => {
  const response = await axios.post(`${API_URL}/analyze`, data);
  return response.data;
};

export const getLearningPath = async (id) => {
  const response = await axios.get(`${API_URL}/learning-path/${id}`);
  return response.data;
};
