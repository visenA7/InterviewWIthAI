import { useState, useCallback, useRef, useEffect } from "react";
import useSpeechRecognition from "./useSpeechRecognition";
import useSpeechSynthesis from "./useSpeechSynthesis";
import api from "../services/api";

export default function useInterview() {
  const [currentStep, setCurrentStep] = useState("setup"); // setup, interviewing, scoring, results, history
  const [sessionId, setSessionId] = useState(null);
  const [config, setConfig] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qaHistory, setQaHistory] = useState([]); // [{ type: 'ai'|'user', text: '...' }]
  const [evaluation, setEvaluation] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [backendError, setBackendError] = useState(null);

  // Helper to add chat history entries
  const appendChat = useCallback((type, text) => {
    setQaHistory((prev) => [
      ...prev,
      { type, text, id: Date.now() + Math.random() },
    ]);
  }, []);

  // Stable ref so handleTTSEnd / TTS error handler can call startListening before
  // it is declared. useSpeechSynthesis and useSpeechRecognition have a circular
  // dependency (each needs a callback that calls the other's output); the ref breaks it.
  const startListeningRef = useRef(null);

  // Text-To-Speech Handlers
  const handleTTSStart = useCallback(() => {
    console.log("AI speaking started");
  }, []);

  const handleTTSEnd = useCallback(() => {
    console.log("AI speaking finished. Switching to user microphone...");
    // When AI stops talking, automatically start listening to the candidate
    if (currentStep === "interviewing") {
      startListeningRef.current?.();
    }
  }, [currentStep]);

  const {
    isSpeaking,
    speak,
    cancel: cancelTTS,
    isSupported: isTtsSupported,
    voices,
    selectedVoice,
    selectVoiceByName,
    rate,
    pitch,
    setRate,
    setPitch,
  } = useSpeechSynthesis({
    onStart: handleTTSStart,
    onEnd: handleTTSEnd,
    onError: (err) => {
      console.error("TTS error:", err);
      // Fallback: if TTS fails, we still want to open the mic so the user can speak
      startListeningRef.current?.();
    },
  });

  // Speech-To-Text Handlers
  const handleSTTCommit = useCallback(
    async (committedText) => {
      if (!sessionId) return;

      console.log(
        "User response committed. Submitting to backend:",
        committedText,
      );
      appendChat("user", committedText);
      setIsProcessing(true);
      setBackendError(null);

      try {
        const result = await api.respondInterview(sessionId, committedText);

        if (result.finished) {
          // Prepare scoring
          console.log("All questions complete. Beginning evaluation...");
          setCurrentStep("scoring");
          const scoreResult = await api.scoreInterview(sessionId);
          setEvaluation(scoreResult.evaluation);
          setCurrentStep("results");
        } else {
          // Next question
          console.log("Moving to next question:", result.question);
          setActiveQuestion(result.question);
          setCurrentQuestionIndex(result.currentQuestionIndex);
          appendChat("ai", result.question);
          setIsProcessing(false);
          // Play the question verbally
          speak(result.question);
        }
      } catch (err) {
        console.error("Failed to submit user response:", err);
        setBackendError(
          `Backend communication error: ${err.message}. Retrying listening...`,
        );
        setIsProcessing(false);
        // Let them retry speaking their answer if backend failed
        startListeningRef.current?.();
      }
    },
    [sessionId, appendChat, speak],
  );

  // Auto-correction State for Speech Recognition
  const [enableCorrection, setEnableCorrection] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('intervai_enable_correction');
      return saved !== 'false';
    }
    return true;
  });

  const [customCorrectionMap, setCustomCorrectionMap] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('intervai_custom_correction_map');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });

  const updateEnableCorrection = useCallback((val) => {
    setEnableCorrection(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('intervai_enable_correction', val.toString());
    }
  }, []);

  const updateCustomCorrectionMap = useCallback((newMap) => {
    setCustomCorrectionMap(newMap);
    if (typeof window !== 'undefined') {
      localStorage.setItem('intervai_custom_correction_map', JSON.stringify(newMap));
    }
  }, []);

  const {
    isListening,
    transcript,
    error: sttError,
    isSupported: isSttSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    silenceTimeoutMs: 5000, // 5s normal pause — enough for natural thinking
    thinkingTimeoutMs: 20000, // 20s when user says "let me think", "hold on", etc.
    onResultCommit: handleSTTCommit,
    enableCorrection,
    customCorrectionMap,
  });

  // Keep the ref in sync with the latest startListening after every render.
  // Must be in useEffect (not inline) because mutating refs during render is a side effect.
  useEffect(() => {
    startListeningRef.current = startListening;
  }, [startListening]);

  // Orchestrate starting the interview
  const startInterview = useCallback(
    async (setupConfig) => {
      setBackendError(null);
      setIsProcessing(true);
      setConfig(setupConfig);
      setQaHistory([]);

      try {
        const result = await api.startInterview(setupConfig);

        setSessionId(result.sessionId);
        setActiveQuestion(result.question);
        setCurrentQuestionIndex(result.currentQuestionIndex);
        setTotalQuestions(result.totalQuestions);
        setCurrentStep("interviewing");

        appendChat("ai", result.question);
        setIsProcessing(false);

        // Play the first question via speech synthesis
        speak(result.question);
      } catch (err) {
        console.error("Failed to start interview:", err);
        setBackendError(err.message);
        setIsProcessing(false);
        setCurrentStep("setup");
      }
    },
    [speak, appendChat],
  );

  // Load Past history
  const loadHistory = useCallback(async () => {
    setBackendError(null);
    try {
      const list = await api.getHistory();
      setHistoryList(list);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setBackendError("Could not load interview history.");
    }
  }, []);

  const deleteInterview = useCallback(
    async (id) => {
      setBackendError(null);
      try {
        await api.deleteInterview(id);
        await loadHistory();
      } catch (err) {
        console.error("Failed to delete interview:", err);
        setBackendError("Could not delete interview session.");
      }
    },
    [loadHistory],
  );

  const clearHistory = useCallback(async () => {
    setBackendError(null);
    try {
      await api.clearHistory();
      setHistoryList([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
      setBackendError("Could not clear history.");
    }
  }, []);

  // Handle exiting or canceling an active session
  const exitInterview = useCallback(() => {
    cancelTTS();
    stopListening();
    setSessionId(null);
    setActiveQuestion("");
    setQaHistory([]);
    setEvaluation(null);
    setCurrentStep("setup");
  }, [cancelTTS, stopListening]);

  // Handle viewing specific session results
  const viewSessionResults = useCallback((session) => {
    setSessionId(session.id);
    setConfig(session.config);

    // Map turns back to display layout
    const turns = [];
    session.turns.forEach((t) => {
      turns.push({
        type: t.role === "assistant" ? "ai" : "user",
        text: t.content,
        id: Math.random(),
      });
    });
    setQaHistory(turns);
    setEvaluation(session.evaluation);
    setCurrentStep("results");
  }, []);

  return {
    currentStep,
    setCurrentStep,
    sessionId,
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

    // Speech states
    isListening,
    transcript,
    sttError,
    isSttSupported,
    isSpeaking,
    isTtsSupported,
    voices,
    selectedVoice,
    selectVoiceByName,
    speak,
    rate,
    pitch,
    setRate,
    setPitch,
    enableCorrection,
    setEnableCorrection: updateEnableCorrection,
    customCorrectionMap,
    setCustomCorrectionMap: updateCustomCorrectionMap,

    // Direct manual overrides
    skipQuestion: useCallback(() => {
      stopListening();
      handleSTTCommit("[Candidate skipped answering this question]");
    }, [stopListening, handleSTTCommit]),

    manualSubmitText: useCallback(
      (text) => {
        stopListening();
        handleSTTCommit(text);
      },
      [stopListening, handleSTTCommit],
    ),
  };
}
