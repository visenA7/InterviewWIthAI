import { useState, useEffect, useCallback, useRef } from 'react';

export default function useSpeechSynthesis(options = {}) {
  const {
    onStart = () => {},
    onEnd = () => {},
    onError = () => {}
  } = options;

  const [rate, setRate] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('intervai_audio_rate');
      return saved ? parseFloat(saved) : (options.rate || 1.0);
    }
    return options.rate || 1.0;
  });

  const [pitch, setPitch] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('intervai_audio_pitch');
      return saved ? parseFloat(saved) : (options.pitch || 1.0);
    }
    return options.pitch || 1.0;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!window.speechSynthesis;
  });

  const activeUtteranceRef = useRef(null);

  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStartRef.current = onStart;
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
  }, [onStart, onEnd, onError]);

  const updateRate = useCallback((newRate) => {
    const val = parseFloat(newRate);
    setRate(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('intervai_audio_rate', val.toString());
    }
  }, []);

  const updatePitch = useCallback((newPitch) => {
    const val = parseFloat(newPitch);
    setPitch(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('intervai_audio_pitch', val.toString());
    }
  }, []);

  // Load and filter suitable English voices
  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);

    // Try loading saved voice first
    const savedVoiceName = typeof window !== 'undefined' ? localStorage.getItem('intervai_audio_voice_name') : null;
    let foundVoice = null;
    if (savedVoiceName) {
      foundVoice = allVoices.find(v => v.name === savedVoiceName);
    }

    if (!foundVoice) {
      // Pick a natural-sounding English voice if available
      const preferredVoices = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Zira',
        'Samantha',
        'Daniel'
      ];

      for (const name of preferredVoices) {
        foundVoice = allVoices.find(v => v.name.includes(name) && v.lang.startsWith('en'));
        if (foundVoice) break;
      }
    }

    if (!foundVoice) {
      // Fallback to any English voice
      foundVoice = allVoices.find(v => v.lang.startsWith('en'));
    }

    if (!foundVoice && allVoices.length > 0) {
      // General fallback
      foundVoice = allVoices[0];
    }

    setSelectedVoice(foundVoice);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const timer = setTimeout(() => {
        loadVoices();
      }, 0);

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      return () => clearTimeout(timer);
    }
  }, [loadVoices]);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    // Cancel any ongoing speaking
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStartRef.current();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEndRef.current();
    };

    utterance.onerror = (event) => {
      // Chrome sometimes throws a 'interrupted' error when starting new utterances which is harmless
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        onErrorRef.current(event);
      }
    };

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, rate, pitch]);

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const selectVoiceByName = useCallback((name) => {
    const voice = voices.find(v => v.name === name);
    if (voice) {
      setSelectedVoice(voice);
      if (typeof window !== 'undefined') {
        localStorage.setItem('intervai_audio_voice_name', name);
      }
    }
  }, [voices]);

  return {
    isSpeaking,
    voices,
    selectedVoice,
    isSupported,
    rate,
    pitch,
    setRate: updateRate,
    setPitch: updatePitch,
    speak,
    cancel,
    selectVoiceByName
  };
}
