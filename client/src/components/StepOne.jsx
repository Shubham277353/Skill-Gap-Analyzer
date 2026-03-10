import { useState } from 'react';
import '../styles/StepOne.css';

const popularSkills = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git', 'Network Security', 
  'Penetration Testing', 'Cryptography', 'Ethical Hacking', 'HTML', 'CSS'
];

function StepOne({ data, onNext }) {
  const [name, setName] = useState(data.name || '');
  const [email, setEmail] = useState(data.email || '');
  const [skills, setSkills] = useState(data.skills || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSkill = (skillName) => {
    if (!skills.find(s => s.name === skillName)) {
      setSkills([...skills, { name: skillName, level: 3 }]);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeSkill = (skillName) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const updateSkillLevel = (skillName, level) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, level } : s));
  };

  const filteredSkills = popularSkills.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !skills.find(skill => skill.name === s)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && skills.length > 0) {
      onNext({ name, email, skills });
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
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Your Skills</label>
          <div className="skill-input-wrapper">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type to search skills..."
            />
            {showSuggestions && filteredSkills.length > 0 && (
              <div className="suggestions">
                {filteredSkills.slice(0, 6).map(skill => (
                  <div key={skill} className="suggestion-item" onClick={() => addSkill(skill)}>
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

        <button type="submit" className="next-btn" disabled={!name || !email || skills.length === 0}>
          Continue to Role Selection →
        </button>
      </form>
    </div>
  );
}

export default StepOne;
