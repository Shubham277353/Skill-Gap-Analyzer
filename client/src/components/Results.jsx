import '../styles/Results.css';

function Results({ data }) {
  if (!data) return null;

  return (
    <div className="results">
      <h2>Analysis Results</h2>
      
      <div className="section">
        <h3>Missing Skills</h3>
        <div className="skills-list">
          {data.missingSkills.map((skill, i) => (
            <span key={i} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      <div className="section">
        <h3>Learning Roadmap</h3>
        <p className="overview">{data.roadmap.overview}</p>
        
        {data.roadmap.phases?.map((phase, i) => (
          <div key={i} className="phase">
            <h4>{phase.phase} - {phase.duration}</h4>
            <div className="phase-content">
              <div>
                <strong>Skills:</strong>
                <ul>
                  {phase.skills.map((skill, j) => (
                    <li key={j}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Resources:</strong>
                <ul>
                  {phase.resources.map((resource, j) => (
                    <li key={j}>{resource}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.roadmap.tips && (
        <div className="section">
          <h3>Tips</h3>
          <ul>
            {data.roadmap.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Results;
