import React, { useState } from 'react';
import './AuthScreen.css';

const AuthScreen = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('demo@interviewiq.ai');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      onLoginSuccess && onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      onLoginSuccess && onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div id="auth-screen">
      <div className="auth-bg"></div>
      <div className="auth-grid"></div>
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">🎯</div>
          <h1>AI Mock Interview</h1>
          <p>Your AI-Powered Interview Coach</p>
        </div>
        
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`} 
            onClick={() => { setTab('login'); setError(null); }}
          >
            Login
          </div>
          <div 
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} 
            onClick={() => { setTab('signup'); setError(null); }}
          >
            Sign Up
          </div>
        </div>

        {error && <div className="auth-error" style={{ display: 'block' }}>{error}</div>}

        {tab === 'login' ? (
          <form id="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="demo-hint">
              <span>Demo: </span><code>demo@interviewiq.ai</code> / <code>demo1234</code>
            </div>
            <button type="submit" className="btn-primary">🔐 Sign In with JWT</button>
          </form>
        ) : (
          <form id="signup-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="Min 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">🚀 Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
