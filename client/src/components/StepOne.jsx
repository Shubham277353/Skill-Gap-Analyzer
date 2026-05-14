import { useState } from 'react';
import '../styles/StepOne.css';

const popularSkills = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git', 'Network Security',
  'Penetration Testing', 'Cryptography', 'Ethical Hacking', 'HTML', 'CSS',
  'TypeScript', 'Express', 'REST API', 'Machine Learning', 'Data Analysis'
];

function StepOne({ data, onNext }) {
  const [name, setName] = useState(data.name || '');
  const [skills, setSkills] = useState(data.skills || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = (skillName) => {
    const trimmed = skillName.trim();
    if (trimmed && !skills.find(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, { name: trimmed, level: 3 }]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        addSkill(searchTerm);
      }
    }
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const updateSkillLevel = (skillName, level) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, level } : s));
  };

  const filteredSkills = popularSkills.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !skills.find(skill => skill.name.toLowerCase() === s.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      addSkill(searchTerm);
      return;
    }
    if (name && skills.length > 0) {
      onNext({ name, skills });
    }
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Tell us about yourself</h2>
        <p>Enter your details and current skills</p>
      </div>

      <form onSubmit={handleSubmit} className="step-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label>Your Skills <span className="hint">— type anything or pick from suggestions, press Enter to add</span></label>
          <div className="skill-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="e.g. React, Python, Networking... press Enter to add"
            />
            {showSuggestions && searchTerm && (
              <div className="suggestions">
                {/* Always show option to add custom skill */}
                {!popularSkills.find(s => s.toLowerCase() === searchTerm.toLowerCase()) && (
                  <div className="suggestion-item add-custom" onMouseDown={() => addSkill(searchTerm)}>
                    ➕ Add "{searchTerm}"
                  </div>
                )}
                {filteredSkills.slice(0, 5).map(skill => (
                  <div key={skill} className="suggestion-item" onMouseDown={() => addSkill(skill)}>
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="skills-list">
            {skills.map(skill => (
              <div key={skill.name} className="skill-item">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <button type="button" onClick={() => removeSkill(skill.name)} className="remove-btn">×</button>
                </div>
                <div className="skill-rating">
                  {[1, 2, 3, 4, 5].map(level => (
                    <span
                      key={level}
                      className={`star ${skill.level >= level ? 'active' : ''}`}
                      onClick={() => updateSkillLevel(skill.name, level)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          className="next-btn"
          disabled={!name || skills.length === 0}
          onClick={() => onNext({ name, skills })}
        >
          Continue to Role Selection →
        </button>
      </form>
    </div>
  );
}

export default StepOne;
