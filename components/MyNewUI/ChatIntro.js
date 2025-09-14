import { useState, useEffect } from "react";
import MySlider from "./MySlider";

function ChatIntro({ messages }) {
  // 👇 Random sentences about your model
  const sentences = [
    "I can roast harder than your bestie 🔥",
    "Compliments so cringe they turn into poetry ✨",
    "Fielding stats assigner 🏏 – beware!",
    "I can turn your post into haddass meme content 🤡",
    "Your dost for chai + gossip sessions ☕",
    "Sometimes sweet, sometimes savage – always fun 🎭",
    "Fake deep quotes? I invent them daily 📜",
    "Complimenting like Shakespeare on Red Bull ⚡",
    "Sarcastic AI dost ban gaya main 💀",
  ];

  const [currentText, setCurrentText] = useState(sentences[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomSentence =
        sentences[Math.floor(Math.random() * sentences.length)];
      setCurrentText(randomSentence);
    }, 3000); // change every 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{ display: messages.length > 0 ? "none" : "block" }}
      className="view new-chat-view"
    >
      {/* <div className="logo animate-fade">{currentText}</div> */}
      <div id="phone-slider">
        <MySlider/>
      </div>
  
    </div>
  );
}

export default ChatIntro;
