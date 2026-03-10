import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getJobRoles = async () => {
  const response = await axios.get(`${API_URL}/job-roles`);
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
