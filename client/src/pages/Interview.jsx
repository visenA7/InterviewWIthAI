import React, { useState } from 'react';
import VoiceOrb from '../components/VoiceOrb';
import Transcript from '../components/Transcript';
import Timer from '../components/Timer';
import './Interview.css';

export default function Interview({
  config,
  activeQuestion,
  currentQuestionIndex,
  totalQuestions,
  isProcessing,
  qaHistory,
  isListening,
  transcript,
  isSpeaking,
  skipQuestion,
  manualSubmitText,
  exitInterview,
  backendError
}) {
  const [textInput, setTextInput] = useState('');
  const [showTextFallback, setShowTextFallback] = useState(false);

  const getOrbState = () => {
    if (isProcessing) return 'thinking';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;
    
    manualSubmitText(textInput.trim());
    setTextInput('');
    setShowTextFallback(false);
  };

  return (
    <div className="interview-container container animate-fade-in">
      
      {/* Top Banner details */}
      <div className="interview-info glass-panel">
        <div className="info-left">
          <span className="info-role">{config?.role}</span>
          <span className="info-dot"></span>
          <span className="info-type">{config?.type} Round</span>
        </div>
        <div className="info-right">
          <span className="progress-badge">Question {currentQuestionIndex} of {totalQuestions}</span>
        </div>
      </div>

      {backendError && (
        <div className="interview-error glass-panel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{backendError}</div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="interview-grid">
        
        {/* Left Side: Voice Orb Controller */}
        <div className="orb-column glass-panel">
          <div className="panel-header">
            <h3>AI Conversation Partner</h3>
            <Timer currentQuestionIndex={currentQuestionIndex} />
          </div>

          <div className="orb-center-wrapper">
            <VoiceOrb state={getOrbState()} micLevel={isListening ? 0.3 : 0} />
          </div>

          <div className="active-question-card glass-panel">
            <div className="active-question-label">Current Question</div>
            <p className="active-question-text">
              {activeQuestion || "Waiting for interviewer to speak..."}
            </p>
          </div>

          <div className="orb-controls">
            <button className="btn btn-secondary btn-small" onClick={() => setShowTextFallback(!showTextFallback)}>
              ⌨️ {showTextFallback ? "Use Voice" : "Type Answer Instead"}
            </button>
            <button className="btn btn-secondary btn-small" onClick={skipQuestion} disabled={isProcessing}>
              ⏭️ Skip Question
            </button>
          </div>
        </div>

        {/* Right Side: Scrollable Live Transcript */}
        <div className="transcript-column">
          <Transcript 
            qaHistory={qaHistory} 
            liveTranscript={transcript} 
            isListening={isListening} 
          />
        </div>

      </div>

      {/* Text input fallback sliding form */}
      {showTextFallback && (
        <form onSubmit={handleManualSubmit} className="text-fallback-form glass-panel animate-slide-up">
          <div className="form-group">
            <label className="form-label" htmlFor="manual-answer">Type Your Response</label>
            <textarea
              id="manual-answer"
              rows="3"
              className="form-textarea"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your detailed interview answer here... (Press Submit or hit Ctrl+Enter)"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleManualSubmit(e);
                }
              }}
              required
            />
          </div>
          <div className="fallback-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowTextFallback(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isProcessing}>
              Submit Written Response
            </button>
          </div>
        </form>
      )}

      {/* Footer controls */}
      <div className="interview-footer">
        <button className="btn btn-danger" onClick={exitInterview}>
          🚪 Terminate Session & Quit
        </button>
        <span className="footer-status-text">
          {isListening ? "🟢 Mic Live - Speak your answer. System will auto-detect when you finish speaking." : ""}
          {isSpeaking ? "🔵 AI is speaking. Please listen attentively." : ""}
          {isProcessing ? "🔮 AI is evaluating your reply..." : ""}
        </span>
      </div>

    </div>
  );
}
