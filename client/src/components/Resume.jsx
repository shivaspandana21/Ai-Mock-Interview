import React, { useState } from 'react';
import './Resume.css';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    // Mock analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      setScore(78);
    }, 1500);
  };

  return (
    <div className="page active" id="page-resume">
      <div className="page-header">
        <h2>📄 Resume Analysis</h2>
        <p>Upload your resume for AI-powered scoring & question generation</p>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="section-title">Upload Resume</div>
            
            <div 
              className="resume-drop" 
              onClick={() => document.getElementById('resume-file').click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <div className="drop-icon">📄</div>
              <h3>Drop your resume here</h3>
              <p>PDF, DOC, DOCX — up to 5MB</p>
              <input 
                type="file" 
                id="resume-file" 
                style={{ display: 'none' }} 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
              />
            </div>

            {file && !score && (
              <div className="card2" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '36px' }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{file.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text2)' }}>
                      Ready for analysis
                    </div>
                  </div>
                  <button className="btn btn-accent btn-sm" onClick={handleAnalyze}>
                    {analyzing ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {score && (
            <div className="card">
              <div className="section-title">Resume Score</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
                <div className="resume-score-ring" style={{ background: `conic-gradient(var(--accent) ${score}%, var(--border) 0)` }}>
                  <div className="resume-score-inner">
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800 }}>{score}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)' }}>/ 100</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="bar-chart">
                    <div className="bar-row">
                      <div className="bar-label">Keywords</div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: '85%', background: 'var(--grad1)' }}></div>
                      </div>
                      <div className="bar-val">85</div>
                    </div>
                    <div className="bar-row">
                      <div className="bar-label">Impact</div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: '60%', background: 'var(--grad2)' }}></div>
                      </div>
                      <div className="bar-val">60</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <div className="section-title">🤖 AI Generated Questions from Resume</div>
            {!score ? (
              <div className="empty-state">Upload and analyze your resume to generate personalized questions</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="card2" style={{ fontSize: '13px' }}>Tell me about a time you improved a system's efficiency by 20% as mentioned in your resume.</div>
                <div className="card2" style={{ fontSize: '13px' }}>Can you explain the architecture behind the React application you built at your last job?</div>
                <button className="btn btn-accent" style={{ marginTop: '12px' }}>🚀 Start Resume-Based Interview</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
