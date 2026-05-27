import React from 'react';
import './Landing.css';

export default function Landing({ onStart, onViewHistory, isSttSupported }) {
  return (
    <div className="landing-container animate-fade-in">
      <div className="hero-section">
        <div className="badge-glow-container">
          <span className="hero-badge">AI-Powered Voice Interviewer</span>
        </div>
        
        <h1 className="hero-title animate-slide-up">
          Ace Your Next Interview With <span className="text-gradient">Local AI</span>
        </h1>
        
        <p className="hero-subtitle animate-slide-up">
          Simulate a realistic live interview. Speak naturally, receive intelligent follow-up questions from a local LLM, and get deep, structured scoring analytics immediately.
        </p>

        {!isSttSupported && (
          <div className="browser-warning glass-panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="warning-icon">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <strong>Browser Speech API Unrecognized:</strong> Live speech recognition is best supported on <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>. 
            </div>
          </div>
        )}

        <div className="hero-actions animate-slide-up">
          <button className="btn btn-primary btn-large" onClick={onStart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            Start Voice Training
          </button>
          <button className="btn btn-secondary btn-large" onClick={onViewHistory}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Review Past Scores
          </button>
        </div>
      </div>

      <div className="features-grid container">
        <div className="feature-card glass-panel">
          <div className="feature-icon-wrapper blue">🎙️</div>
          <h3>Live Voice Chat</h3>
          <p>Talk directly into your microphone. The app transcribes, processes, and responds dynamically using local Speech-to-Text and Text-to-Speech synthesis.</p>
        </div>
        
        <div className="feature-card glass-panel">
          <div className="feature-icon-wrapper purple">🤖</div>
          <h3>LM Studio Powered</h3>
          <p>Runs fully locally on your machine with total privacy. Configured seamlessly with your currently loaded model at localhost:1234.</p>
        </div>

        <div className="feature-card glass-panel">
          <div className="feature-icon-wrapper green">📊</div>
          <h3>Detailed Analytical Feedback</h3>
          <p>Receive evaluations across 5 critical dimensions: Relevance, Depth, Clarity, Technical Accuracy, and Delivery with detailed per-question commentary.</p>
        </div>
      </div>
    </div>
  );
}
