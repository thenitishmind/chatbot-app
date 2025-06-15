// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
}

// Speech synthesis setup
const synth = window.speechSynthesis;

export const startListening = (onResult, onError) => {
  if (!recognition) {
    onError('Speech recognition is not supported in this browser');
    return;
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('');
    
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(event.error);
  };

  recognition.start();
};

export const stopListening = () => {
  if (recognition) {
    recognition.stop();
  }
};

export const speakText = (text) => {
  if (!synth) {
    console.error('Speech synthesis is not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  synth.speak(utterance);
};

export const stopSpeaking = () => {
  if (synth) {
    synth.cancel();
  }
}; 