"use client";
import { useState } from "react";

export default function VoiceAssistant({ onClose }) {
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold mb-4">Voice Assistant 🎤</h2>

        <button
          onClick={startListening}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Start Talking
        </button>

        {transcript && (
          <p className="mt-4 text-gray-700">You said: {transcript}</p>
        )}
      </div>
    </div>
  );
}
