import { useState, useEffect } from 'react';
import { getJobRoles, analyzeSkills } from '../services/api';
import '../styles/SkillForm.css';

function SkillForm({ onAnalysisComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentSkills: '',
    targetRole: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobRoles();
  }, []);

  const loadJobRoles = async () => {
    try {
      const roles = await getJobRoles();
      setJobRoles(roles);
    } catch (error) {
      console.error('Error loading job roles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.currentSkills.split(',').map(s => s.trim());
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('currentSkills', JSON.stringify(skillsArray));
      data.append('targetRole', formData.targetRole);
      if (resumeFile) {
        data.append('resume', resumeFile);
      }
      const result = await analyzeSkills(data);
      onAnalysisComplete(result);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skill-form">
      <h2>Skill Gap Analysis</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Current Skills (comma separated)"
          value={formData.currentSkills}
          onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
          required
        />
        <select
          value={formData.targetRole}
          onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
          required
        >
          <option value="">Select Target Role</option>
          {jobRoles.map(role => (
            <option key={role._id} value={role.title}>{role.title}</option>
          ))}
        </select>
        <div className="file-upload">
          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
          {resumeFile && <span className="file-name">{resumeFile.name}</span>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Skills'}
        </button>
      </form>
    </div>
  );
}

export default SkillForm;
