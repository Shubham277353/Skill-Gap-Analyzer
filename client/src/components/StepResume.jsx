import { useState } from 'react';
import '../styles/StepResume.css';

function StepResume({ data, onNext, onBack }) {
  const [resumeFile, setResumeFile] = useState(data.resumeFile || null);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Upload Your Resume</h2>
        <p>Help us give you a more accurate analysis — or skip this step</p>
      </div>

      <div className="resume-box">
        <div className="resume-icon">📄</div>
        <h3>Upload Resume (PDF)</h3>
        <p>We'll extract your skills and experience automatically for a more personalized roadmap.</p>

        <label className="file-label" htmlFor="resume">
          {resumeFile ? `✓ ${resumeFile.name}` : 'Choose PDF File'}
        </label>
        <input
          type="file"
          id="resume"
          accept=".pdf"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />

        {resumeFile && (
          <button className="remove-file" onClick={() => setResumeFile(null)}>
            ✕ Remove file
          </button>
        )}
      </div>

      <div className="button-group">
        <button type="button" onClick={onBack} className="back-btn">← Back</button>
        <button
          type="button"
          onClick={() => onNext({ resumeFile })}
          className="next-btn"
        >
          {resumeFile ? 'Continue with Resume →' : 'Skip & Continue →'}
        </button>
      </div>
    </div>
  );
}

export default StepResume;
