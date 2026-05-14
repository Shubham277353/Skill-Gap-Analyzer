import { useState, useEffect } from 'react';
import { getAnalysisHistory } from '../services/api';
import '../styles/HistoryPage.css';

function HistoryPage({ token, onNewAnalysis, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAnalysisHistory(token);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#3b82f6';
    if (score >= 30) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1>📊 Your Analysis History</h1>
          <p>Track your skill development over time</p>
        </div>
        <div className="history-actions">
          <button onClick={onNewAnalysis} className="new-analysis-btn">+ New Analysis</button>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="history-loading">Loading your history...</div>
      ) : history.length === 0 ? (
        <div className="history-empty">
          <span>🎯</span>
          <h3>No analyses yet</h3>
          <p>Start your first skill gap analysis to see results here</p>
          <button onClick={onNewAnalysis} className="new-analysis-btn">Start Analysis</button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item, i) => (
            <div key={i} className="history-card">
              <div className="history-card-header">
                <h3>{item.targetRole}</h3>
                <span className="history-date">{formatDate(item.createdAt)}</span>
              </div>
              <div className="history-score">
                <div className="score-ring" style={{ borderColor: getScoreColor(item.matchScore) }}>
                  <span style={{ color: getScoreColor(item.matchScore) }}>{item.matchScore}%</span>
                </div>
                <div className="history-meta">
                  <p>Match Score</p>
                  <span className={`level-tag ${item.careerLevel?.toLowerCase()}`}>{item.careerLevel}</span>
                </div>
              </div>
              <div className="history-skills">
                {item.missingSkills?.critical?.slice(0, 3).map((s, j) => (
                  <span key={j} className="history-skill-tag">{s}</span>
                ))}
                {item.missingSkills?.critical?.length > 3 && (
                  <span className="history-skill-tag">+{item.missingSkills.critical.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
