import React, { useEffect } from 'react';
import './History.css';

export default function History({ historyList, loadHistory, onViewDetails, onExit }) {
  
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="history-container container animate-slide-up">
      <div className="history-header">
        <h2>Interview Archive</h2>
        <p>Review and track your skill progression across all past local training runs.</p>
      </div>

      <div className="history-body">
        {historyList.length === 0 ? (
          <div className="history-empty glass-panel">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h3>No Interviews Logged Yet</h3>
            <p>Your finished sessions, scores, and custom feedback reports will be saved here automatically.</p>
            <button className="btn btn-primary" onClick={onExit}>
              Setup New Session
            </button>
          </div>
        ) : (
          <div className="history-list">
            {historyList.map((session) => (
              <div key={session.id} className="history-item glass-panel">
                <div className="item-meta">
                  <span className="meta-date">{formatDate(session.createdAt)}</span>
                  <div className="meta-title-row">
                    <h3 className="meta-role">{session.config.role}</h3>
                    <span className="meta-badge-type">{session.config.type}</span>
                  </div>
                  <div className="meta-details-row">
                    <span className="meta-detail">Difficulty: <strong>{session.config.difficulty}</strong></span>
                    <span className="meta-detail-dot"></span>
                    <span className="meta-detail">Questions: <strong>{session.config.numQuestions}</strong></span>
                  </div>
                </div>

                <div className="item-stats">
                  {session.status === 'completed' && session.evaluation ? (
                    <div className="score-stat-display">
                      <div className="score-label">Score</div>
                      <span className={`score-badge-val ${getScoreColor(session.evaluation.overallScore)}`}>
                        {session.evaluation.overallScore}%
                      </span>
                    </div>
                  ) : (
                    <span className="status-badge active-badge">Active Session</span>
                  )}
                  
                  <button 
                    className="btn btn-secondary view-report-btn" 
                    onClick={() => onViewDetails(session)}
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
