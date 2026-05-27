import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Setup from "./pages/Setup";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import History from "./pages/History";
import useInterview from "./hooks/useInterview";
import "./App.css";

export default function App() {
  const {
    currentStep,
    setCurrentStep,
    config,
    activeQuestion,
    currentQuestionIndex,
    totalQuestions,
    isProcessing,
    qaHistory,
    evaluation,
    historyList,
    backendError,
    setBackendError,

    // Actions
    startInterview,
    exitInterview,
    loadHistory,
    viewSessionResults,
    deleteInterview,
    clearHistory,

    // Speech States
    isListening,
    transcript,
    sttError,
    isSttSupported,
    isSpeaking,
    skipQuestion,
    manualSubmitText,
    voices,
    selectedVoice,
    selectVoiceByName,
    speak,
    rate,
    pitch,
    setRate,
    setPitch,
    enableCorrection,
    setEnableCorrection,
    customCorrectionMap,
    setCustomCorrectionMap,
  } = useInterview();

  // Sub-step inside 'setup' to toggle between Landing page and Config Form
  const [showConfigForm, setShowConfigForm] = useState(false);

  const handleStartSetup = () => {
    setBackendError(null);
    setShowConfigForm(true);
  };

  const handleBackToLanding = () => {
    setShowConfigForm(false);
    exitInterview();
  };

  const renderContent = () => {
    switch (currentStep) {
      case "setup":
        if (!showConfigForm) {
          return (
            <Landing
              onStart={handleStartSetup}
              onViewHistory={() => setCurrentStep("history")}
              isSttSupported={isSttSupported}
            />
          );
        }
        return (
          <Setup
            onSubmit={startInterview}
            isProcessing={isProcessing}
            backendError={backendError}
            voices={voices}
            selectedVoice={selectedVoice}
            selectVoiceByName={selectVoiceByName}
            speak={speak}
            rate={rate}
            pitch={pitch}
            setRate={setRate}
            setPitch={setPitch}
            enableCorrection={enableCorrection}
            setEnableCorrection={setEnableCorrection}
            customCorrectionMap={customCorrectionMap}
            setCustomCorrectionMap={setCustomCorrectionMap}
          />
        );

      case "interviewing":
        return (
          <Interview
            config={config}
            activeQuestion={activeQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isProcessing={isProcessing}
            qaHistory={qaHistory}
            isListening={isListening}
            transcript={transcript}
            isSpeaking={isSpeaking}
            skipQuestion={skipQuestion}
            manualSubmitText={manualSubmitText}
            exitInterview={handleBackToLanding}
            backendError={backendError || sttError}
            voices={voices}
            selectedVoice={selectedVoice}
            selectVoiceByName={selectVoiceByName}
            speak={speak}
            rate={rate}
            pitch={pitch}
            setRate={setRate}
            setPitch={setPitch}
            enableCorrection={enableCorrection}
            setEnableCorrection={setEnableCorrection}
            customCorrectionMap={customCorrectionMap}
            setCustomCorrectionMap={setCustomCorrectionMap}
          />
        );

      case "scoring":
        return <Results config={config} evaluation={null} />;

      case "results":
        return (
          <Results
            config={config}
            evaluation={evaluation}
            onRestart={handleBackToLanding}
            onViewHistory={() => setCurrentStep("history")}
          />
        );

      case "history":
        return (
          <History
            historyList={historyList}
            loadHistory={loadHistory}
            onViewDetails={viewSessionResults}
            onExit={handleBackToLanding}
            deleteInterview={deleteInterview}
            clearHistory={clearHistory}
          />
        );

      default:
        return (
          <Landing
            onStart={handleStartSetup}
            onViewHistory={() => setCurrentStep("history")}
            isSttSupported={isSttSupported}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Background Animated Glows */}
      <div className="background-glow">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      <Navbar
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onExit={handleBackToLanding}
      />

      <main className="main-content">{renderContent()}</main>

      <footer className="global-footer container">
        <p>© 2026 IntervAI. Running local inference securely via LM Studio.</p>
      </footer>
    </div>
  );
}
