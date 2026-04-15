import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/Dashboard.css';

function Dashboard({ data, onRestart }) {
  const { matchScore, gapLevel, strengths, skillCoverage, aiSummary, missingSkills, roadmap, recommendedCertifications, careerLevel, aiConfidence, assessmentResult } = data;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [simulatedScore, setSimulatedScore] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    let start = 0;
    const end = simulatedScore || matchScore;
    const increment = end / (2000 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setAnimatedScore(end); clearInterval(timer); }
      else setAnimatedScore(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [matchScore, simulatedScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#3b82f6';
    if (score >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const handleSimulate = () => {
    setSimulatedScore(Math.min(98, matchScore + 28));
    setIsSimulated(true);
  };

  const toggleTask = (monthIndex, taskIndex) => {
    const key = `${monthIndex}-${taskIndex}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = roadmap.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const totalRequired = (strengths?.length || 0) + (missingSkills?.critical?.length || 0) + (missingSkills?.important?.length || 0) + (missingSkills?.optional?.length || 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Your Skill Analysis Report</h1>
          <p>AI-powered career intelligence for <strong>{data.targetRole || 'your target role'}</strong></p>
        </div>
        <div className="header-actions">
          <button onClick={onRestart} className="restart-btn">🔄 New Analysis</button>
        </div>
      </div>

      {/* AI Insight */}
      <div className="card ai-insight-card">
        <div className="ai-badge">
          <span className="ai-icon">🤖</span>
          <span>AI Insight Summary</span>
          <span className="confidence-badge">Confidence: {aiConfidence}%</span>
        </div>
        <p className="ai-summary">{aiSummary}</p>
      </div>

      {/* Top Row */}
      <div className="top-grid">
        {/* Match Score */}
        <div className="card score-card">
          <h3>Skill Match Score</h3>
          <div className="score-circle">
            <CircularProgressbar
              value={animatedScore}
              text={`${animatedScore}%`}
              styles={buildStyles({
                pathColor: getScoreColor(animatedScore),
                textColor: getScoreColor(animatedScore),
                trailColor: '#e5e7eb',
                pathTransitionDuration: 0.5
              })}
            />
          </div>
          <p className="score-detail">
            <strong>{strengths?.length || 0}</strong> of <strong>{totalRequired}</strong> required skills matched
          </p>
          <p className="gap-level">
            Gap Level: <span className={`badge ${gapLevel?.toLowerCase()}`}>{gapLevel}</span>
          </p>
          {isSimulated && (
            <div className="simulation-result">
              <p className="improvement">📈 Projected: +{simulatedScore - matchScore}% after roadmap</p>
            </div>
          )}
        </div>

        {/* Career Level */}
        <div className="card level-card">
          <h3>Career Level</h3>
          <div className="level-scale">
            {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
              <div key={level} className={`scale-marker ${careerLevel === level ? 'active' : ''}`}>
                {level}
              </div>
            ))}
          </div>
          <p className="level-explanation">
            Based on your skill coverage ({matchScore}%) and proficiency ratings, you are at <strong>{careerLevel}</strong> level.
          </p>
        </div>

        {/* Strengths */}
        <div className="card strengths-card">
          <h3>✅ Matched Skills</h3>
          {strengths?.length > 0 ? (
            <div className="strength-list">
              {strengths.map((s, i) => (
                <div key={i} className="strength-item">
                  <span className="check">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-msg">No matched skills yet. Start learning the required skills!</p>
          )}
        </div>
      </div>

      {/* Skill Coverage - Real Data */}
      {skillCoverage?.length > 0 && (
        <div className="card coverage-card">
          <h3>📊 Required Skills Coverage</h3>
          <p className="coverage-subtitle">How your skills map to the role requirements</p>
          <div className="coverage-grid">
            {skillCoverage.map((item, i) => (
              <div key={i} className={`coverage-item ${item.covered ? 'covered' : 'missing'}`}>
                <div className="coverage-header">
                  <span className="coverage-skill">{item.skill}</span>
                  <span className="coverage-status">{item.covered ? '✓' : '✗'}</span>
                </div>
                {item.covered && (
                  <div className="coverage-bar">
                    <div className="coverage-fill" style={{ width: `${(item.level / 5) * 100}%` }}></div>
                  </div>
                )}
                <span className="coverage-label">
                  {item.covered ? `Proficiency: ${item.level}/5` : 'Not in your skills'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Result */}
      {assessmentResult && (
        <div className="card assessment-result-card">
          <h3>📝 Skill Assessment Result</h3>
          <div className="assessment-summary">
            <div className={`assessment-score-badge ${assessmentResult.percentage >= 80 ? 'green' : assessmentResult.percentage >= 50 ? 'yellow' : 'red'}`}>
              <span>{assessmentResult.score}/{assessmentResult.total}</span>
              <span>{assessmentResult.percentage}%</span>
            </div>
            <div className="assessment-info">
              <p>Skill Level: <strong>{assessmentResult.skillLevel}</strong></p>
              <div className="assessment-bar-wrap">
                <div className={`assessment-bar-fill ${assessmentResult.percentage >= 80 ? 'green' : assessmentResult.percentage >= 50 ? 'yellow' : 'red'}`}
                  style={{ width: `${assessmentResult.percentage}%` }}>
                </div>
              </div>
            </div>
          </div>
          {assessmentResult.weakAreas?.length > 0 && (
            <div className="weak-areas-dashboard">
              <h4>⚠️ Weak Areas from Test</h4>
              <div className="weak-tags">
                {assessmentResult.weakAreas.slice(0, 5).map((area, i) => (
                  <span key={i} className="weak-tag">{area}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Missing Skills */}
      <div className="card missing-skills-card">
        <h3>🎯 Skills to Develop</h3>
        {(missingSkills?.critical?.length === 0 && missingSkills?.important?.length === 0 && missingSkills?.optional?.length === 0) ? (
          <p className="empty-msg">🎉 You have all the required skills for this role!</p>
        ) : (
          <div className="skills-categories">
            {missingSkills?.critical?.length > 0 && (
              <div className="skill-category">
                <h4>🔴 Critical — Learn First</h4>
                <div className="skill-tags">
                  {missingSkills.critical.map((s, i) => <span key={i} className="skill-tag critical">{s}</span>)}
                </div>
              </div>
            )}
            {missingSkills?.important?.length > 0 && (
              <div className="skill-category">
                <h4>🟡 Important</h4>
                <div className="skill-tags">
                  {missingSkills.important.map((s, i) => <span key={i} className="skill-tag important">{s}</span>)}
                </div>
              </div>
            )}
            {missingSkills?.optional?.length > 0 && (
              <div className="skill-category">
                <h4>🟢 Good to Have</h4>
                <div className="skill-tags">
                  {missingSkills.optional.map((s, i) => <span key={i} className="skill-tag optional">{s}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Roadmap */}
      <div className="card roadmap-card">
        <div className="roadmap-header">
          <h3>📅 Your Learning Roadmap</h3>
          <div className="roadmap-progress">
            <span>{completedCount}/{totalTasks} tasks done</span>
            <div className="progress-bar-small">
              <div className="progress-fill-small" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span>{progressPercent}%</span>
          </div>
        </div>
        <div className="timeline">
          {roadmap.map((phase, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">{i + 1}</div>
              <div className="timeline-content">
                <h4>{phase.month}</h4>
                <ul>
                  {phase.tasks.map((task, j) => {
                    const key = `${i}-${j}`;
                    const title = typeof task === 'string' ? task : task.title;
                    const difficulty = typeof task === 'object' ? task.difficulty : null;
                    const time = typeof task === 'object' ? task.estimatedTime : null;
                    return (
                      <li key={j} className={completedTasks[key] ? 'completed' : ''} onClick={() => toggleTask(i, j)}>
                        <input type="checkbox" checked={completedTasks[key] || false} onChange={() => {}} />
                        <span className="task-title">{title}</span>
                        {difficulty && <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>{difficulty}</span>}
                        {time && <span className="time-badge">⏱ {time}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
        {!isSimulated && (
          <button onClick={handleSimulate} className="simulate-btn">
            🔮 Simulate Score After Completing Roadmap
          </button>
        )}
      </div>

      {/* Certifications */}
      {recommendedCertifications?.length > 0 && (
        <div className="card certifications-card">
          <h3>🎓 Recommended Certifications</h3>
          <div className="cert-grid">
            {recommendedCertifications.map((cert, i) => (
              <div key={i} className="cert-item">
                <span className="cert-icon">📜</span>
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
