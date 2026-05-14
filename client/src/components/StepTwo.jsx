import { useState } from 'react';
import { getJobRoles } from '../services/api';
import '../styles/StepTwo.css';

function StepTwo({ data, roles, onNext, onBack }) {
  const [selectedRole, setSelectedRole] = useState(data.targetRole || '');

  const handleRoleClick = (roleTitle) => {
    setSelectedRole(roleTitle);
    setTimeout(() => {
      onNext({ targetRole: roleTitle });
    }, 600);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Choose your target role</h2>
        <p>Click on a role to continue automatically</p>
      </div>

      <div className="step-form">
        <div className="roles-grid">
          {roles.map(role => (
            <div
              key={role._id}
              className={`role-card ${selectedRole === role.title ? 'selected' : ''}`}
              onClick={() => handleRoleClick(role.title)}
            >
              <div className="role-icon">
                {role.title.includes('Frontend') && '🎨'}
                {role.title.includes('Backend') && '⚙️'}
                {role.title.includes('Full Stack') && '💻'}
                {role.title.includes('DevOps') && '🚀'}
                {role.title.includes('Cyber') && '🔒'}
                {role.title.includes('Data Scientist') && '📊'}
                {role.title.includes('Machine Learning') && '🤖'}
                {role.title.includes('Cloud') && '☁️'}
                {role.title.includes('Mobile') && '📱'}
                {role.title.includes('UI/UX') && '🎭'}
                {role.title.includes('Blockchain') && '⛓️'}
                {role.title.includes('Data Engineer') && '🔧'}
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

        <div className="button-group">
          <button type="button" onClick={onBack} className="back-btn">← Back</button>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
