import { useState, useEffect, useRef, useCallback } from "react";

// Phrases that signal the user needs more time to think
const THINKING_PHRASES = [
  "let me think",
  "give me a moment",
  "one moment",
  "one second",
  "hold on",
  "umm",
  "uh",
];

export default function useSpeechRecognition(options = {}) {
  const {
    continuous = true,
    interimResults = true,
    lang = "en-US",
    silenceTimeoutMs = 7000,   // Default: 7 s — comfortable pause for natural speech
    thinkingTimeoutMs = 20000, // Extended: 20 s when user says a thinking phrase
    onResultCommit = () => {}, // Callback when final transcript is committed
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const [isSupported] = useState(() => {
    if (typeof window === "undefined") return false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognition;
  });

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const isListeningRef = useRef(false);     // Persistent ref to prevent state desyncs
  const intentionalStopRef = useRef(false); // true when stopListening was called deliberately
  const accumulatedTranscriptRef = useRef(""); // Holds text across browser-internal restarts

  const onResultCommitRef = useRef(onResultCommit);
  const silenceTimeoutMsRef = useRef(silenceTimeoutMs);
  const thinkingTimeoutMsRef = useRef(thinkingTimeoutMs);

  useEffect(() => {
    onResultCommitRef.current = onResultCommit;
    silenceTimeoutMsRef.current = silenceTimeoutMs;
    thinkingTimeoutMsRef.current = thinkingTimeoutMs;
  }, [onResultCommit, silenceTimeoutMs, thinkingTimeoutMs]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    intentionalStopRef.current = true; // Mark as a deliberate stop so onend won't restart
    isListeningRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore if already stopped
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    accumulatedTranscriptRef.current = ""; // Clear accumulator on intentional stop
    setIsListening(false);
  }, []);

  const resetSilenceTimerRef = useRef(null);

  const resetSilenceTimer = useCallback(
    (currentText) => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      if (!isListeningRef.current || !currentText) return;

      // Check if user is signalling they need more time to think
      const lowerText = currentText.toLowerCase();
      const needsMoreTime = THINKING_PHRASES.some((phrase) =>
        lowerText.includes(phrase)
      );
      const delay = needsMoreTime
        ? thinkingTimeoutMsRef.current
        : silenceTimeoutMsRef.current;

      if (needsMoreTime) {
        console.log(`Thinking phrase detected — extending silence window to ${delay}ms`);
      }

      silenceTimerRef.current = setTimeout(() => {
        console.log("Silence detected, committing transcript:", currentText);
        onResultCommitRef.current(currentText);
        // Clear transcript and accumulator once committed
        accumulatedTranscriptRef.current = "";
        setTranscript("");
        // Stop listening to wait for next prompt response
        stopListening();
      }, delay);
    },
    [stopListening],
  );

  // Keep resetSilenceTimerRef up-to-date on every render
  useEffect(() => {
    resetSilenceTimerRef.current = resetSilenceTimer;
  });

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = continuous;
      rec.interimResults = interimResults;
      rec.lang = lang;

      rec.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setError(null);
      };

      rec.onend = () => {
        setIsListening(false);
        // Only auto-restart if this was NOT a deliberate stop and we were still listening
        if (isListeningRef.current && !intentionalStopRef.current) {
          console.log("Recognition ended unexpectedly — restarting to preserve transcript accumulation");
          try {
            rec.start();
            // Note: isListeningRef stays true, setIsListening will be re-set by onstart
            return;
          } catch (e) {
            console.error("Failed to auto-restart recognition:", e);
          }
        }
        // Deliberate stop — reset flags
        isListeningRef.current = false;
        intentionalStopRef.current = false;
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError(
            "Microphone permission blocked. Please enable access in browser settings.",
          );
        } else if (event.error === "no-speech") {
          // Ignorable error, browser stops due to no speech, will trigger onend -> auto restart
        } else {
          setError(`Speech error: ${event.error}`);
        }
      };

      rec.onresult = (event) => {
        let interimTranscript = "";
        let newFinalSegment = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            newFinalSegment += transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
          }
        }

        // Accumulate finalized segments across browser restarts
        if (newFinalSegment) {
          accumulatedTranscriptRef.current = (
            accumulatedTranscriptRef.current + " " + newFinalSegment
          ).trim();
        }

        // Full transcript = everything committed so far + current interim words
        const fullLiveTranscript = (
          accumulatedTranscriptRef.current +
          (interimTranscript ? " " + interimTranscript : "")
        ).trim();

        if (fullLiveTranscript) {
          setTranscript(fullLiveTranscript);
          resetSilenceTimerRef.current?.(fullLiveTranscript);
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        isListeningRef.current = false;
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [continuous, interimResults, lang]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return;
    if (isListeningRef.current) return;

    // Reset accumulated state for a fresh answer
    accumulatedTranscriptRef.current = "";
    intentionalStopRef.current = false;
    setTranscript("");
    setError(null);
    isListeningRef.current = true;
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      isListeningRef.current = false;
    }
  }, [isSupported]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
