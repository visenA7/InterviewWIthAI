import { useState } from "react";
import "./Setup.css";

export default function Setup({ onSubmit, isProcessing, backendError }) {
  const [type, setType] = useState("Technical");
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);

  // Advanced LLM settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [llmProvider, setLlmProvider] = useState("lmstudio"); // lmstudio, ollama, custom
  const [llmUrl, setLlmUrl] = useState("http://localhost:1234/v1");
  const [llmModel, setLlmModel] = useState("mistralai/ministral-3-3b");

  // Chip input for focus areas
  const [focusInput, setFocusInput] = useState("");
  const [focusAreas, setFocusAreas] = useState([
    "React",
    "Node.js",
    "System Design",
  ]);

  const handleProviderChange = (provider) => {
    setLlmProvider(provider);
    if (provider === "lmstudio") {
      setLlmUrl("http://localhost:1234/v1");
      setLlmModel("mistralai/ministral-3-3b");
    } else if (provider === "ollama") {
      setLlmUrl("http://localhost:11434/v1");
      setLlmModel("llama3");
    } else {
      setLlmUrl("http://localhost:");
      setLlmModel("");
    }
  };

  const handleAddChip = (e) => {
    e.preventDefault();
    if (focusInput.trim() && !focusAreas.includes(focusInput.trim())) {
      setFocusAreas([...focusAreas, focusInput.trim()]);
      setFocusInput("");
    }
  };

  const handleRemoveChip = (chip) => {
    setFocusAreas(focusAreas.filter((c) => c !== chip));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    onSubmit({
      type,
      role: role.trim(),
      difficulty,
      numQuestions,
      focusAreas,
      llmSettings: showAdvanced
        ? {
            provider: llmProvider,
            url: llmUrl.trim(),
            model: llmModel.trim(),
          }
        : null,
    });
  };

  return (
    <div className="setup-container animate-slide-up">
      <div className="setup-header">
        <h2>Setup Your Interview</h2>
        <p>
          Customize the local AI interviewer to match your target role and
          goals.
        </p>
      </div>

      {backendError && (
        <div className="backend-error glass-panel">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="error-icon"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{backendError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="setup-form glass-panel">
        {/* Toggle between Technical and Behavioral */}
        <div className="form-group">
          <span className="form-label">Interview Type</span>
          <div className="type-toggle-container">
            <button
              type="button"
              className={`toggle-btn ${type === "Technical" ? "active" : ""}`}
              onClick={() => setType("Technical")}
            >
              💻 Technical Round
            </button>
            <button
              type="button"
              className={`toggle-btn ${type === "Behavioral" ? "active" : ""}`}
              onClick={() => setType("Behavioral")}
            >
              🤝 Behavioral / HR
            </button>
          </div>
        </div>

        {/* Role Name */}
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Target Role / Position
            </label>
            <input
              id="role"
              type="text"
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer, Product Manager"
              required
              disabled={isProcessing}
            />
          </div>

          {/* Difficulty Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="difficulty">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              className="form-select"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              disabled={isProcessing}
            >
              <option value="Easy">Easy (Conceptual / Standard)</option>
              <option value="Medium">
                Medium (Applied Scenario / Tradeoffs)
              </option>
              <option value="Hard">
                Hard (Deep Dive / Advanced Edge Cases)
              </option>
            </select>
          </div>
        </div>

        {/* Focus Areas Chips Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="focus-input">
            Skills & Focus Areas
          </label>
          <div className="focus-chips-input-container">
            <input
              id="focus-input"
              type="text"
              className="form-input chip-input"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="e.g. React, SQL, STAR method (Press Enter to add)"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddChip(e);
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary add-chip-btn"
              onClick={handleAddChip}
            >
              Add
            </button>
          </div>

          <div className="chips-wrapper">
            {focusAreas.map((chip, idx) => (
              <span key={idx} className="focus-chip">
                {chip}
                <button
                  type="button"
                  className="remove-chip-btn"
                  onClick={() => handleRemoveChip(chip)}
                >
                  &times;
                </button>
              </span>
            ))}
            {focusAreas.length === 0 && (
              <span className="no-chips-text">
                No custom focus areas. General interview questions will be
                generated.
              </span>
            )}
          </div>
        </div>

        {/* Number of Questions Slider */}
        <div className="form-group">
          <div className="slider-label-row">
            <label className="form-label">Number of Questions</label>
            <span className="slider-value-badge">{numQuestions} Questions</span>
          </div>
          <input
            type="range"
            className="form-slider"
            min="3"
            max="10"
            step="1"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value, 10))}
            disabled={isProcessing}
          />
          <div className="slider-ticks">
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>

        {/* Collapsible Advanced Settings */}
        <div className="advanced-llm-section">
          <button
            type="button"
            className="advanced-toggle-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>
              {showAdvanced ? "⚙️ Hide" : "⚙️ Show"} Advanced Local LLM Settings
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`arrow-icon ${showAdvanced ? "expanded" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showAdvanced && (
            <div className="advanced-llm-panel glass-panel animate-fade-in">
              <div className="form-group">
                <span className="form-label">Local LLM Provider</span>
                <div className="provider-tabs">
                  <button
                    type="button"
                    className={`provider-tab ${llmProvider === "lmstudio" ? "active" : ""}`}
                    onClick={() => handleProviderChange("lmstudio")}
                  >
                    🏢 LM Studio
                  </button>
                  <button
                    type="button"
                    className={`provider-tab ${llmProvider === "ollama" ? "active" : ""}`}
                    onClick={() => handleProviderChange("ollama")}
                  >
                    🦙 Ollama
                  </button>
                  <button
                    type="button"
                    className={`provider-tab ${llmProvider === "custom" ? "active" : ""}`}
                    onClick={() => handleProviderChange("custom")}
                  >
                    🛠️ Custom Endpoint
                  </button>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="llm-url">
                    API Base URL
                  </label>
                  <input
                    id="llm-url"
                    type="text"
                    className="form-input"
                    value={llmUrl}
                    onChange={(e) => setLlmUrl(e.target.value)}
                    placeholder="http://localhost:1234/v1"
                    disabled={isProcessing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="llm-model">
                    Model Name
                  </label>
                  <input
                    id="llm-model"
                    type="text"
                    className="form-input"
                    value={llmModel}
                    onChange={(e) => setLlmModel(e.target.value)}
                    placeholder="e.g. mistral, llama3, phi3"
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
              <p className="advanced-info-text">
                Ensure your local server is running (e.g., LM Studio API enabled
                or Ollama server up) before launching.
              </p>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary start-btn"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="btn-spinner"></div>
              Initializing Local LLM IntervAI...
            </>
          ) : (
            <>🚀 Launch Local Interview</>
          )}
        </button>
      </form>
    </div>
  );
}
