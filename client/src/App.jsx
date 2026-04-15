import { useState } from 'react';
import StepOne from './components/StepOne';
import StepResume from './components/StepResume';
import StepTwo from './components/StepTwo';
import SkillAssessment from './components/SkillAssessment';
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

  const handleStepResume = (data) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const handleStepTwo = (data) => {
    setFormData({ ...formData, ...data });
    setStep(4);
  };

  const handleAssessmentComplete = async (assessmentResult) => {
    await runAnalysis(assessmentResult);
  };

  const handleAssessmentSkip = async () => {
    await runAnalysis(null);
  };

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

  const stepLabels = ['Skills', 'Resume', 'Role', 'Test', 'Analysis'];

  return (
    <div className="app">
      {!loading && step < 5 && (
        <header>
          <h1>AI Career Intelligence Platform</h1>
          <p>Discover your skill gaps and get personalized career guidance</p>
          <div className="progress-indicator">
            {stepLabels.map((label, i) => (
              <>
                <div key={label} className={`progress-step ${step >= i + 1 ? 'active' : ''}`}>
                  <div className="step-circle">{i + 1}</div>
                  <span>{label}</span>
                </div>
                {i < stepLabels.length - 1 && <div className="progress-line"></div>}
              </>
            ))}
          </div>
        </header>
      )}

      <main>
        {loading && <LoadingScreen />}
        {!loading && step === 1 && <StepOne data={formData} onNext={handleStepOne} />}
        {!loading && step === 2 && <StepResume data={formData} onNext={handleStepResume} onBack={() => setStep(1)} />}
        {!loading && step === 3 && <StepTwo data={formData} onNext={handleStepTwo} onBack={() => setStep(2)} />}
        {!loading && step === 4 && (
          <SkillAssessment
            targetRole={formData.targetRole}
            onComplete={handleAssessmentComplete}
            onSkip={handleAssessmentSkip}
          />
        )}
        {!loading && step === 5 && results && <Dashboard data={results} onRestart={handleRestart} />}
      </main>
    </div>
  );
}

export default App;
