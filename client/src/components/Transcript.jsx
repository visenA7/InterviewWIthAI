import { useEffect, useRef } from "react";
import "./Transcript.css";

export default function Transcript({ qaHistory, liveTranscript, isListening }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    // Scroll the transcript container to the bottom whenever qaHistory or live transcript updates
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [qaHistory, liveTranscript]);

  return (
    <div className="transcript-container glass-panel">
      <div className="transcript-header">
        <span className="transcript-title">Interview Transcript</span>
        <span className="transcript-badge">
          {qaHistory.length} turns completed
        </span>
      </div>

      <div ref={bodyRef} className="transcript-body">
        {qaHistory.length === 0 && !liveTranscript && (
          <div className="transcript-empty">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="empty-icon"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>Your dialogue with the AI will appear here in real-time.</p>
          </div>
        )}

        {qaHistory.map((item) => (
          <div
            key={item.id}
            className={`dialogue-row ${item.type === "ai" ? "row-ai" : "row-user"} animate-slide-up`}
          >
            <div className="dialogue-avatar">
              {item.type === "ai" ? "🤖" : "👤"}
            </div>
            <div className="dialogue-bubble">
              <div className="dialogue-sender">
                {item.type === "ai" ? "AI Interviewer" : "You (Spoken Answer)"}
              </div>
              <div className="dialogue-text">{item.text}</div>
            </div>
          </div>
        ))}

        {isListening && liveTranscript && (
          <div className="dialogue-row row-user row-live">
            <div className="dialogue-avatar">👤</div>
            <div className="dialogue-bubble live-bubble">
              <div className="dialogue-sender">
                You (Transcribing...)
                <span className="live-pulse"></span>
              </div>
              <div className="dialogue-text live-text">{liveTranscript}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
