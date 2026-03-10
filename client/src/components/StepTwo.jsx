import { useState, useEffect } from 'react';
import { getJobRoles } from '../services/api';
import '../styles/StepTwo.css';

function StepTwo({ data, onNext, onBack }) {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(data.targetRole || '');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await getJobRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole) {
      onNext({ targetRole: selectedRole, resumeFile });
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Choose your target role</h2>
        <p>Select the career path you want to pursue</p>
      </div>

      <form onSubmit={handleSubmit} className="step-form">
        <div className="roles-grid">
          {roles.map(role => (
            <div
              key={role._id}
              className={`role-card ${selectedRole === role.title ? 'selected' : ''}`}
              onClick={() => setSelectedRole(role.title)}
            >
              <div className="role-icon">
                {role.title.includes('Frontend') && '🎨'}
                {role.title.includes('Backend') && '⚙️'}
                {role.title.includes('Full Stack') && '💻'}
                {role.title.includes('DevOps') && '🚀'}
                {role.title.includes('Cyber') && '🔒'}
              </div>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <div className="role-skills">
                {role.requiredSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="skill-badge">{skill}</span>
                ))}
                {role.requiredSkills.length > 3 && (
                  <span className="skill-badge">+{role.requiredSkills.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="resume-upload">
          <label htmlFor="resume">📄 Upload Resume (Optional)</label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />
          {resumeFile && <span className="file-name">✓ {resumeFile.name}</span>}
        </div>

        <div className="button-group">
          <button type="button" onClick={onBack} className="back-btn">
            ← Back
          </button>
          <button type="submit" className="next-btn" disabled={!selectedRole}>
            Analyze My Skills →
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepTwo;
