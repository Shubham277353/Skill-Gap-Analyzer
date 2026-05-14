import { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import StepOne from './components/StepOne';
import StepResume from './components/StepResume';
import StepTwo from './components/StepTwo';
import SkillAssessment from './components/SkillAssessment';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import HistoryPage from './components/HistoryPage';
import { analyzeSkills, getJobRoles } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [view, setView] = useState('history'); // 'history' | 'analysis'
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [jobRoles, setJobRoles] = useState([]);

  // Check for existing session on load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch roles once user is logged in
  useEffect(() => {
    if (user) getJobRoles().then(setJobRoles).catch(console.error);
  }, [user]);

  const handleAuth = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setView('history');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setView('history');
    setStep(1);
    setFormData({});
    setResults(null);
  };

  const startNewAnalysis = () => {
    setStep(1);
    setFormData({});
    setResults(null);
    setView('analysis');
  };

  const handleStepOne = (data) => { setFormData({ ...formData, ...data }); setStep(2); };
  const handleStepResume = (data) => { setFormData({ ...formData, ...data }); setStep(3); };
  const handleStepTwo = (data) => { setFormData({ ...formData, ...data }); setStep(4); };

  const handleAssessmentComplete = async (assessmentResult) => { await runAnalysis(assessmentResult); };
  const handleAssessmentSkip = async () => { await runAnalysis(null); };

  const runAnalysis = async (assessmentResult) => {
    setLoading(true);
    try {
      const merged = { ...formData };
      const payload = new FormData();
      payload.append('name', merged.name);
      payload.append('email', merged.email);
      payload.append('currentSkills', JSON.stringify(merged.skills));
      payload.append('targetRole', merged.targetRole);
      if (merged.resumeFile) payload.append('resume', merged.resumeFile);
      if (assessmentResult) payload.append('assessmentResult', JSON.stringify(assessmentResult));

      const result = await analyzeSkills(payload);
      setResults(result);
      setStep(5);
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Skills', 'Resume', 'Role', 'Test', 'Analysis'];

  // Not logged in - show auth page
  if (!user) return <AuthPage onAuth={handleAuth} />;

  // Show history page
  if (view === 'history') {
    return (
      <HistoryPage
        token={token}
        onNewAnalysis={startNewAnalysis}
        onLogout={handleLogout}
      />
    );
  }

  // Show analysis flow
  return (
    <div className="app">
      {!loading && step < 5 && (
        <header>
          <div className="header-top">
            <h1>AI Career Intelligence Platform</h1>
            <div className="header-user">
              <span>👋 {user.name}</span>
              <button onClick={() => setView('history')} className="history-btn">📊 History</button>
              <button onClick={handleLogout} className="logout-header-btn">Logout</button>
            </div>
          </div>
          <p>Discover your skill gaps and get personalized career guidance</p>
          <div className="progress-indicator">
            {stepLabels.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                <div className={`progress-step ${step >= i + 1 ? 'active' : ''}`}>
                  <div className="step-circle">{i + 1}</div>
                  <span>{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className="progress-line"></div>}
              </div>
            ))}
          </div>
        </header>
      )}

      <main>
        {loading && <LoadingScreen />}
        {!loading && step === 1 && <StepOne data={formData} onNext={handleStepOne} />}
        {!loading && step === 2 && <StepResume data={formData} onNext={handleStepResume} onBack={() => setStep(1)} />}
        {!loading && step === 3 && <StepTwo data={formData} roles={jobRoles} onNext={handleStepTwo} onBack={() => setStep(2)} />}
        {!loading && step === 4 && (
          <SkillAssessment
            targetRole={formData.targetRole}
            onComplete={handleAssessmentComplete}
            onSkip={handleAssessmentSkip}
          />
        )}
        {!loading && step === 5 && results && (
          <Dashboard
            data={results}
            onRestart={startNewAnalysis}
            onHistory={() => setView('history')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
