import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, onNavigate, onLogout, user }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-row">
          <div className="logo-badge">🎯</div>
          <h2>AI Mock Interview</h2>
        </div>
      </div>
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar" id="user-avatar">{user ? user.name[0].toUpperCase() : 'U'}</div>
          <div>
            <div className="name" id="user-name-display">{user ? user.name : 'Unknown User'}</div>
            <div className="role">Interview Candidate</div>
          </div>
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section">Overview</div>
        <div 
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('dashboard')}
        >
          <span className="nav-icon">📊</span> Dashboard
        </div>
        <div 
          className={`nav-item ${activePage === 'resume' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('resume')}
        >
          <span className="nav-icon">📄</span> Resume Analysis
        </div>

        <div className="nav-section">Practice</div>
        <div 
          className={`nav-item ${activePage === 'stream' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('stream')}
        >
          <span className="nav-icon">🎓</span> Stream Mock Interview
        </div>
        <div 
          className={`nav-item ${activePage === 'company' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('company')}
        >
          <span className="nav-icon">🏢</span> Company Mock Interview
        </div>
        <div 
          className={`nav-item ${activePage === 'questions' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('questions')}
        >
          <span className="nav-icon">❓</span> Question Bank <span className="nav-badge">60+</span>
        </div>
        <div 
          className={`nav-item ${activePage === 'video' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('video')}
        >
          <span className="nav-icon">🎥</span> Video Interview
        </div>

        <div className="nav-section">Analytics</div>
        <div 
          className={`nav-item ${activePage === 'reports' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('reports')}
        >
          <span className="nav-icon">📋</span> Smart Feedback Report
        </div>
        <div 
          className={`nav-item ${activePage === 'comparison' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('comparison')}
        >
          <span className="nav-icon">📈</span> Company Comparison
        </div>
        <div 
          className={`nav-item ${activePage === 'predictor' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('predictor')}
        >
          <span className="nav-icon">🔮</span> Selection Predictor
        </div>
        <div 
          className={`nav-item ${activePage === 'improvement' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('improvement')}
        >
          <span className="nav-icon">📉</span> Improvement Graph
        </div>
        <div 
          className={`nav-item ${activePage === 'weakareas' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('weakareas')}
        >
          <span className="nav-icon">⚠️</span> Weak Area Analysis
        </div>
        <div 
          className={`nav-item ${activePage === 'recordings' ? 'active' : ''}`} 
          onClick={() => onNavigate && onNavigate('recordings')}
        >
          <span className="nav-icon">🎞️</span> Recordings
        </div>
      </div>
      <div className="sidebar-bottom">
        <button className="btn-logout" onClick={() => onLogout && onLogout()}>🚪 Sign Out</button>
      </div>
    </div>
  );
};

export default Sidebar;
