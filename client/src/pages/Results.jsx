import React, { useState } from 'react';
import RadarChart from '../components/RadarChart';
import './Results.css';

export default function Results({ config, evaluation, onRestart, onViewHistory }) {
  const [activeTab, setActiveTab] = useState('summary'); // summary, questions
  const [expandedIndex, setExpandedIndex] = useState(null);

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getVerbalRating = (score) => {
    if (score >= 85) return 'Distinguished';
    if (score >= 70) return 'Proficient';
    if (score >= 55) return 'Developing';
    return 'Needs Focus';
  };

  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!evaluation) {
    return (
      <div className="results-loading container glass-panel">
        <div className="results-loading-spinner"></div>
        <h2>Analyzing Your Answers...</h2>
        <p>Our local AI recruiter is reviewing the transcripts and compiling your constructive scorecard. This will take just a moment.</p>
      </div>
    );
  }

  const { overallScore, dimensions, strengths, improvements, questionFeedback, verdict } = evaluation;

  return (
    <div className="results-container container animate-fade-in">
      
      {/* Top dashboard summary header */}
      <div className="results-header glass-panel">
        <div className="header-info">
          <h2>Interview Performance Analysis</h2>
          <p>{config?.role} — {config?.type} Round</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={onRestart}>
            🔄 Try Another Session
          </button>
          <button className="btn btn-secondary" onClick={onViewHistory}>
            📜 View Archive
          </button>
        </div>
      </div>

      {/* Grid Dashboard */}
      <div className="results-grid">
        
        {/* Left Side: Score Widget & Radar Chart */}
        <div className="score-summary-card glass-panel">
          <div className="score-ring-wrapper">
            <div className={`score-ring-color ${getScoreColor(overallScore)}`}>
              <div className="score-ring-inner">
                <span className="score-number">{overallScore}</span>
                <span className="score-max">/ 100</span>
                <span className="score-badge-text">{getVerbalRating(overallScore)}</span>
              </div>
            </div>
          </div>

          <div className="radar-wrapper">
            <h4 className="card-subtitle">Skills Profile</h4>
            <RadarChart dimensions={dimensions} />
          </div>
        </div>

        {/* Right Side: Tabbed Details */}
        <div className="analytics-details-card">
          <div className="tab-navigation glass-panel">
            <button 
              className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              📋 Executive Summary
            </button>
            <button 
              className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
              onClick={() => setActiveTab('questions')}
            >
              🎙️ Per-Question Breakdown
            </button>
          </div>

          {activeTab === 'summary' && (
            <div className="tab-pane summary-pane animate-fade-in">
              {/* Verdict Section */}
              <div className="verdict-section glass-panel">
                <h4 className="section-title text-gradient">The Verdict</h4>
                <p className="verdict-text">{verdict}</p>
              </div>

              {/* Strengths and Weaknesses Grid */}
              <div className="summary-columns">
                <div className="summary-column strengths glass-panel">
                  <h4 className="column-title">
                    <span className="col-icon">🟢</span> Key Strengths
                  </h4>
                  <ul className="bullet-list">
                    {strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-column improvements glass-panel">
                  <h4 className="column-title">
                    <span className="col-icon">🟡</span> Areas for Growth
                  </h4>
                  <ul className="bullet-list">
                    {improvements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="tab-pane questions-pane animate-fade-in">
              <div className="questions-list">
                {questionFeedback.map((feedback, idx) => (
                  <div 
                    key={idx} 
                    className={`question-card glass-panel ${expandedIndex === idx ? 'expanded' : ''}`}
                  >
                    <div className="question-card-header" onClick={() => toggleQuestion(idx)}>
                      <div className="q-header-left">
                        <span className="q-index">Q{idx + 1}</span>
                        <p className="q-preview">{feedback.question}</p>
                      </div>
                      <div className="q-header-right">
                        <span className={`q-score-badge ${getScoreColor(feedback.score)}`}>
                          {feedback.score}%
                        </span>
                        <svg className="chevron-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    </div>

                    <div className="question-card-body">
                      <div className="body-block">
                        <span className="block-label">Your Response</span>
                        <p className="block-text response-text">
                          "{feedback.answer || "[No answer provided]"}"
                        </p>
                      </div>
                      
                      <div className="body-block font-glow-border">
                        <span className="block-label crit-label">AI Recruiter Critique</span>
                        <p className="block-text critique-text">
                          {feedback.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
