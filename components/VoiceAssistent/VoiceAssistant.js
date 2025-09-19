// VoiceAssistant.tsx
"use client";

import { useState } from "react";

export default function VoiceAssistant() {
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };
  };

  return (
    <div>
      <button 
        onClick={startListening} 
        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Start Talking 🎙️
      </button>
      {transcript && <p className="mt-4 text-gray-700">You said: {transcript}</p>}
    </div>
  );
}
