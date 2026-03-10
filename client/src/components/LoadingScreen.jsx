import { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

function LoadingScreen() {
  const [step, setStep] = useState(0);
  
  const steps = [
    '🔍 Analyzing your profile...',
    '📊 Comparing with industry benchmarks...',
    '🤖 Generating personalized roadmap...',
    '✨ Finalizing recommendations...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="ai-brain">
          <div className="pulse"></div>
          <div className="pulse delay-1"></div>
          <div className="pulse delay-2"></div>
        </div>
        <h2>AI Analysis in Progress</h2>
        <p className="loading-step">{steps[step]}</p>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
