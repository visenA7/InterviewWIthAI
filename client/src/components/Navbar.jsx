import React from 'react';
import './Navbar.css';

export default function Navbar({ currentStep, setCurrentStep, onExit }) {
  return (
    <header className="navbar glass-panel">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={onExit}>
          <div className="brand-logo-container">
            <svg className="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              <path d="M12 1A11 11 0 1 0 23 12A11 11 0 0 0 12 1ZM12 20a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" fill="currentColor" opacity="0.3"/>
            </svg>
            <div className="logo-glow"></div>
          </div>
          <span className="brand-name">
            Interv<span className="brand-highlight">AI</span>
          </span>
        </div>

        <nav className="navbar-actions">
          {currentStep === 'setup' && (
            <button 
              className="navbar-link btn-secondary" 
              onClick={() => setCurrentStep('history')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="9" />
              </svg>
              View History
            </button>
          )}

          {(currentStep === 'history' || currentStep === 'results') && (
            <button 
              className="navbar-link btn-secondary" 
              onClick={onExit}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Setup
            </button>
          )}

          {currentStep === 'interviewing' && (
            <div className="live-badge">
              <span className="pulse-dot"></span>
              Live Interview Session
            </div>
          )}

          <div className="lm-studio-status">
            <span className="status-label">LM Studio</span>
            <span className="status-dot connected"></span>
          </div>
        </nav>
      </div>
    </header>
  );
}
