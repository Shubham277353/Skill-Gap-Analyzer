import { useState } from 'react';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import { analyzeSkills } from './services/api';
import './App.css';

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleStepOne = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const handleStepTwo = async (data) => {
    setFormData({ ...formData, ...data });
    setLoading(true);
    
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('currentSkills', JSON.stringify(formData.skills));
      payload.append('targetRole', data.targetRole);
      if (data.resumeFile) {
        payload.append('resume', data.resumeFile);
      }
      
      const result = await analyzeSkills(payload);
      setResults(result);
      setStep(3);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setFormData({});
    setResults(null);
  };

  return (
    <div className="app">
      {!loading && step < 3 && (
        <header>
          <h1>AI Career Intelligence Platform</h1>
          <p>Discover your skill gaps and get personalized career guidance</p>
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-circle">1</div>
              <span>Skills</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <span>Role</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Analysis</span>
            </div>
          </div>
        </header>
      )}

      <main>
        {loading && <LoadingScreen />}
        {!loading && step === 1 && <StepOne data={formData} onNext={handleStepOne} />}
        {!loading && step === 2 && <StepTwo data={formData} onNext={handleStepTwo} onBack={() => setStep(1)} />}
        {!loading && step === 3 && results && <Dashboard data={results} onRestart={handleRestart} />}
      </main>
    </div>
  );
}

export default App;
