import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';
import '../styles/Dashboard.css';

function Dashboard({ data, onRestart }) {
  const { matchScore, gapLevel, strengths, aiSummary, industryComparison, missingSkills, roadmap, recommendedCertifications, careerLevel, radarData, aiConfidence } = data;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [simulatedScore, setSimulatedScore] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    // Animated count-up effect
    let start = 0;
    const end = simulatedScore || matchScore;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [matchScore, simulatedScore]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const handleSimulate = () => {
    const improvement = Math.min(95, matchScore + 25);
    setSimulatedScore(improvement);
    setIsSimulated(true);
    setAnimatedScore(0); // Reset to trigger animation
  };

  const toggleTask = (monthIndex, taskIndex) => {
    const key = `${monthIndex}-${taskIndex}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalTasks = roadmap.reduce((sum, month) => sum + month.tasks.length, 0);
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const displayScore = simulatedScore || animatedScore;
  const totalRequired = strengths.length + missingSkills.critical.length + missingSkills.important.length + missingSkills.optional.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Your Skill Analysis Report</h1>
          <p>AI-powered career intelligence insights</p>
        </div>
        <div className="header-actions">
          <button onClick={() => alert('PDF Export - Integrate jsPDF')} className="export-btn">📥 Export PDF</button>
          <button onClick={onRestart} className="restart-btn">🔄 New Analysis</button>
        </div>
      </div>

      {/* AI Insight Summary - Top Priority */}
      <div className="card ai-insight-card">
        <div className="ai-badge">
          <span className="ai-icon">🤖</span>
          <span>AI Insight Summary</span>
          <span className="confidence-badge">Confidence: {aiConfidence}%</span>
        </div>
        <p className="ai-summary">{aiSummary}</p>
      </div>

      <div className="dashboard-grid">
        {/* Enhanced Match Score */}
        <div className="card score-card">
          <h3>Skill Match Score</h3>
          <div className="score-circle">
            <CircularProgressbar
              value={displayScore}
              text={`${displayScore}%`}
              styles={buildStyles({
                pathColor: getScoreColor(displayScore),
                textColor: getScoreColor(displayScore),
                trailColor: '#e5e7eb',
                pathTransitionDuration: 0.5
              })}
            />
          </div>
          <p className="score-detail">You match <strong>{strengths.length}</strong> out of <strong>{totalRequired}</strong> core competencies</p>
          <p className="gap-level">Gap Level: <span className={`badge ${gapLevel.toLowerCase()}`}>{gapLevel}</span></p>
          {isSimulated && (
            <div className="simulation-result">
              <p className="improvement">📈 Projected Improvement: +{simulatedScore - matchScore}%</p>
              <p className="simulation-note">After completing roadmap</p>
            </div>
          )}
        </div>

        {/* Enhanced Career Level */}
        <div className="card level-card">
          <h3>Career Level</h3>
          <div className="level-scale">
            <div className="scale-track">
              <div className={`scale-marker ${careerLevel === 'Beginner' ? 'active' : ''}`}>Beginner</div>
              <div className={`scale-marker ${careerLevel === 'Intermediate' ? 'active' : ''}`}>Intermediate</div>
              <div className={`scale-marker ${careerLevel === 'Advanced' ? 'active' : ''}`}>Advanced</div>
              <div className={`scale-marker ${careerLevel === 'Expert' ? 'active' : ''}`}>Expert</div>
            </div>
          </div>
          <p className="level-explanation">Based on your skills coverage and depth, you are currently at <strong>{careerLevel}</strong> level.</p>
        </div>

        {/* Radar Chart */}
        <div className="card radar-card">
          <h3>Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip />
              <Radar name="Your Skills" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Strengths */}
        <div className="card strengths-card">
          <h3>💪 Your Strengths</h3>
          <div className="strength-list">
            {strengths.map((strength, i) => (
              <div key={i} className="strength-item">
                <span className="check">✓</span>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Benchmark */}
      <div className="card benchmark-card">
        <h3>📊 Industry Benchmark Comparison</h3>
        <div className="benchmark-grid">
          {industryComparison.map((item, i) => (
            <div key={i} className="benchmark-item">
              <div className="benchmark-header">
                <span>{item.skill}</span>
                <span className="scores">You: {item.yourScore}% | Avg: {item.industryAvg}%</span>
              </div>
              <div className="benchmark-bars">
                <div className="bar-container">
                  <div className="bar your-bar" style={{ width: `${item.yourScore}%` }}></div>
                </div>
                <div className="bar-container">
                  <div className="bar avg-bar" style={{ width: `${item.industryAvg}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="card missing-skills-card">
        <h3>Skills to Develop</h3>
        <div className="skills-categories">
          {missingSkills.critical?.length > 0 && (
            <div className="skill-category">
              <h4>🔴 Critical</h4>
              <div className="skill-tags">
                {missingSkills.critical.map((skill, i) => (
                  <span key={i} className="skill-tag critical">{skill}</span>
                ))}
              </div>
            </div>
          )}
          {missingSkills.important?.length > 0 && (
            <div className="skill-category">
              <h4>🟡 Important</h4>
              <div className="skill-tags">
                {missingSkills.important.map((skill, i) => (
                  <span key={i} className="skill-tag important">{skill}</span>
                ))}
              </div>
            </div>
          )}
          {missingSkills.optional?.length > 0 && (
            <div className="skill-category">
              <h4>🟢 Optional</h4>
              <div className="skill-tags">
                {missingSkills.optional.map((skill, i) => (
                  <span key={i} className="skill-tag optional">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Interactive Roadmap */}
      <div className="card roadmap-card">
        <div className="roadmap-header">
          <h3>📅 Your Learning Roadmap</h3>
          <div className="roadmap-progress">
            <span>Progress: {progressPercent}%</span>
            <div className="progress-bar-small">
              <div className="progress-fill-small" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
        <div className="timeline">
          {roadmap.map((phase, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">{i + 1}</div>
              <div className="timeline-content">
                <h4>{phase.month}</h4>
                <ul>
                  {phase.tasks.map((task, j) => (
                    <li key={j} className={completedTasks[`${i}-${j}`] ? 'completed' : ''}>
                      <input 
                        type="checkbox" 
                        checked={completedTasks[`${i}-${j}`] || false}
                        onChange={() => toggleTask(i, j)}
                      />
                      <span className="task-title">{typeof task === 'string' ? task : task.title}</span>
                      {task.difficulty && (
                        <span className={`difficulty-badge ${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
                      )}
                      {task.estimatedTime && (
                        <span className="time-badge">⏱️ {task.estimatedTime}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSimulate} className="simulate-btn">
          🔮 Simulate After Completing Roadmap
        </button>
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
