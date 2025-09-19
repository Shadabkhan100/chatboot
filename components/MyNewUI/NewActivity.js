import React, { useEffect, useRef,useState } from 'react'
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import ChatIntro from "./ChatIntro";
import { useRouter } from "next/navigation";
import VoiceAssistant from "./VoiceChat/VoiceAssistant";

function NewActivity({ scrolRef, chatID, isHistoryRoute }) {
   const [showVoiceModal, setShowVoiceModal] = useState(false);
  const router = useRouter();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error
  } = useChat({ api: "/api/gemini" });
   const [openVoice, setOpenVoice] = useState(false);

  const createdChatRef = useRef(false);

  useEffect(() => {
    if (messages.length === 0 || isLoading) return;

    const firstUserMsg = messages.find((m) => m.role === "user");
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) : "Untitled";

    let existingChats = JSON.parse(localStorage.getItem("chats") || "[]");

    if (isHistoryRoute && chatID) {
      // ✅ Update existing chat
      const chatIndex = existingChats.findIndex(
        (chat) => chat.id.toString() === chatID.toString()
      );

      if (chatIndex !== -1) {
        existingChats[chatIndex] = {
          ...existingChats[chatIndex],
          messages,
          title,
          date: new Date().toISOString(),
        };
      }
    } else {
      // ✅ Only create once when first user message arrives
      if (!chatID && !createdChatRef.current) {
        const newChat = {
          id: Date.now(),
          title,
          messages,
          date: new Date().toISOString(),
        };
        existingChats.push(newChat);

        // Save immediately
        localStorage.setItem("chats", JSON.stringify(existingChats));

        // ✅ Update browser URL
        router.push(`/history/${newChat.id}`);

        createdChatRef.current = true; // prevent duplicates
      }
    }

    localStorage.setItem("chats", JSON.stringify(existingChats));
  }, [messages, isLoading, chatID, isHistoryRoute]);


  const HandleCopy = (data) => {
    navigator.clipboard.writeText(data);
    window.alert("Copied to clipboard!");
  };
  useEffect(() => {
    if (scrolRef.current) {
      scrolRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



   
 

  
  return (
    <>
      <main>
        {/* If no messages, show placeholder */}
        <div style={{ display: messages.length > 0 ? "none" : "block" }} className="view new-chat-view">
          {/* <div className="logo"><ChatIntro messages={messages} /></div> */}
        </div>

        {/* If there are messages, render them */}
        <div style={{ display: messages.length > 0 ? "block" : "none", paddingBottom: "52px" }} className="view conversation-view">
          <div className="model-name">
            <i className="fa fa-bolt"></i> Default (GPT-3.5)
          </div>

          {messages.map((data, index) => (
            <div key={index}>
              {data.role === "user" && (
                <div style={{ justifyContent: "right", padding: "8px 12px 8px 1px" }} className="user message">
                  <div className="identity">
                    <i className="user-icon">u</i>
                  </div>
                  <div className="content">
                    <p id="userMessageMobile">{data.content}</p>
                  </div>
                </div>
              )}

              {data.role === "assistant" && (
                <div
                  style={{ justifyContent: "left", padding: "5px 9px 5px 10px", position: "relative" }}
                  className="assistant message"
                >
                  <div className="content">
                    <ReactMarkdown>{data.content}</ReactMarkdown>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => HandleCopy(data.content)}
                    title="Copy response"
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      right: "6px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    <svg color="white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                    </svg>
                  </button>
                </div>
              )}

            </div>
          ))}

          {/* Loading & Error states */}
          {isLoading && (
            <div className="assistant message" style={{ padding: "10px" }}>
              <div className="identity">
                <i className="gpt user-icon">G</i>
              </div>
              <div className="content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Loader */}
                <div className="typing-loader">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>

                {/* Stop button (icon only) */}
                <button style={{
                  padding: "7px", marginLeft: "28px"
                }} onClick={() => stop()} className="stop-btn" title="Stop generating">
                  ⏹
                </button>
              </div>
            </div>
          )}



          {error && (
            <div className="assistant message" style={{ justifyContent: "center", padding: "10px" }}>
              <div className="content">
                <p>An error occurred.</p>
                <button onClick={() => reload()}>Retry</button>
              </div>
            </div>
          )}

          <div ref={scrolRef} />
        </div>


      </main>
      <form id="message-form" onSubmit={handleSubmit}>
        <div className="message-wrapper">
          <textarea
            id="message"
            rows={1}
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="mic-button"
            onClick={() => setShowVoiceModal(true)}
          >
            <svg color="white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic-fill" viewBox="0 0 16 16">
  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
</svg>
          </button>
          <button type="submit" className="send-button" disabled={isLoading}>
            <svg color="white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </button>
        </div>
        <div className="disclaimer">
          This is a ChatGPT UI Clone for personal use and educational purposes only.
        </div>
      </form>
      {showVoiceModal && (
        <VoiceAssistant onClose={() => setShowVoiceModal(false)} />
      )}
    </>


  )
}

export default NewActivity