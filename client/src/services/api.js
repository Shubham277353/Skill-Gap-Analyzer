import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getJobRoles = async () => {
  const response = await axios.get(`${API_URL}/job-roles`);
  return response.data;
};

export const signup = async (data) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

export const getMe = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAnalysisHistory = async (token) => {
  const response = await axios.get(`${API_URL}/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
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
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/analyze`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getLearningPath = async (id) => {
  const response = await axios.get(`${API_URL}/learning-path/${id}`);
  return response.data;
};
