import { useState, useEffect } from 'react';
import { getAssessmentQuestions, submitAssessment } from '../services/api';
import '../styles/SkillAssessment.css';

function SkillAssessment({ targetRole, onComplete, onSkip }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await getAssessmentQuestions(targetRole);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const updated = [...answers, selected];
    setAnswers(updated);
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      handleSubmit(updated);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const res = await submitAssessment(targetRole, finalAnswers);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return 'green';
    if (pct >= 50) return 'yellow';
    return 'red';
  };

  if (loading) return (
    <div className="assessment-container">
      <div className="assessment-loading">Loading questions...</div>
    </div>
  );

  if (!questions.length) return (
    <div className="assessment-container">
      <div className="result-card" style={{ textAlign: 'center' }}>
        <h2>⚠️ Could not load questions</h2>
        <p>Assessment questions are unavailable for this role.</p>
        <div className="result-actions">
          <button onClick={onSkip} className="continue-btn">Skip & Continue to Analysis →</button>
        </div>
      </div>
    </div>
  );

  if (submitting) return (
    <div className="assessment-container">
      <div className="assessment-loading">Evaluating your answers...</div>
    </div>
  );

  if (result) return (
    <div className="assessment-container">
      <div className="result-card">
        <div className={`result-score ${getScoreColor(result.percentage)}`}>
          <span className="result-number">{result.score}/{result.total}</span>
          <span className="result-pct">{result.percentage}%</span>
        </div>

        <h2>Assessment Complete!</h2>

        <div className={`level-badge-result ${getScoreColor(result.percentage)}`}>
          {result.percentage >= 80 ? '🏆' : result.percentage >= 50 ? '📈' : '🌱'} {result.skillLevel}
        </div>

        <div className="result-bar-container">
          <div className={`result-bar ${getScoreColor(result.percentage)}`} style={{ width: `${result.percentage}%` }}></div>
        </div>

        {result.weakAreas.length > 0 && (
          <div className="weak-areas">
            <h4>⚠️ Weak Areas Detected</h4>
            <ul>
              {result.weakAreas.slice(0, 4).map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="result-actions">
          <button onClick={handleRetry} className="retry-btn">🔄 Retry Test</button>
          <button onClick={() => onComplete(result)} className="continue-btn">
            Continue to Analysis →
          </button>
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h2>Skill Assessment — {targetRole}</h2>
        <p>These questions test your knowledge of the <strong>{targetRole}</strong> role to personalize your roadmap.</p>
        <p>Question {current + 1} of {questions.length}</p>
      </div>

      <div className="progress-track">
        <div className="progress-fill-track" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-card">
        <p className="question-text">{q.question}</p>
        <div className="options-list">
          {q.options.map((opt, i) => (
            <div
              key={i}
              className={`option ${selected === i ? 'selected' : ''}`}
              onClick={() => handleSelect(i)}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="assessment-actions">
        <button onClick={onSkip} className="skip-btn">Skip Test</button>
        <button
          onClick={handleNext}
          className="next-btn-assessment"
          disabled={selected === null}
        >
          {current + 1 === questions.length ? 'Submit →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

export default SkillAssessment;
