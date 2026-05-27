import React, { useState, useEffect } from 'react';
import './Timer.css';

export default function Timer({ currentQuestionIndex }) {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  useEffect(() => {
    // Reset question timer when the question changes
    setQuestionSeconds(0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      setQuestionSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timers-container">
      <div className="timer-pill glass-panel">
        <span className="timer-dot red"></span>
        <span className="timer-label">Total Time:</span>
        <span className="timer-value">{formatTime(totalSeconds)}</span>
      </div>
      <div className="timer-pill glass-panel">
        <span className="timer-dot blue"></span>
        <span className="timer-label">Question:</span>
        <span className="timer-value">{formatTime(questionSeconds)}</span>
      </div>
    </div>
  );
}
