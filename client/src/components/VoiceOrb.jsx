import React from 'react';
import './VoiceOrb.css';

export default function VoiceOrb({ state, micLevel = 0 }) {
  // state: 'idle' | 'listening' | 'speaking' | 'thinking'

  const getStateClasses = () => {
    switch (state) {
      case 'speaking': return 'orb-speaking';
      case 'listening': return 'orb-listening';
      case 'thinking': return 'orb-thinking';
      default: return 'orb-idle';
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'speaking': return 'AI is Speaking';
      case 'listening': return 'Listening... Speak now';
      case 'thinking': return 'AI is processing...';
      default: return 'Tap to start';
    }
  };

  return (
    <div className={`orb-wrapper ${getStateClasses()}`}>
      <div className="orb-outer-glow"></div>
      
      {/* Concentric pulsing rings */}
      <div className="orb-ring ring-3"></div>
      <div className="orb-ring ring-2"></div>
      <div className="orb-ring ring-1"></div>

      {/* Core animated orb */}
      <div className="orb-core">
        <div className="orb-inner-content">
          {state === 'listening' && (
            <div className="voice-bars">
              <span className="bar" style={{ transform: `scaleY(${1 + micLevel * 2})` }}></span>
              <span className="bar" style={{ transform: `scaleY(${1 + micLevel * 3.5})` }}></span>
              <span className="bar" style={{ transform: `scaleY(${1 + micLevel * 5})` }}></span>
              <span className="bar" style={{ transform: `scaleY(${1 + micLevel * 3.5})` }}></span>
              <span className="bar" style={{ transform: `scaleY(${1 + micLevel * 2})` }}></span>
            </div>
          )}
          {state === 'speaking' && (
            <svg className="sound-wave" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v18c-4.97 0-9-4.03-9-9s4.03-9 9-9zm2 3.82c1.84.4 3.32 1.88 3.72 3.72l-3.72.63V6.82zm0 6.64l3.72.63c-.4 1.84-1.88 3.32-3.72 3.72v-4.35z"/>
            </svg>
          )}
          {state === 'thinking' && (
            <div className="thinking-spinner"></div>
          )}
          {state === 'idle' && (
            <svg className="mic-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.42 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          )}
        </div>
      </div>

      <div className="orb-status-text">{getLabel()}</div>
    </div>
  );
}
