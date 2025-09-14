import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "@ai-sdk/react";

function History({ scrolRef, historyId }) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error,
  } = useChat({ api: "/api/gemini" });

  const [historyMessages, setHistoryMessages] = useState([]);

  // ✅ Load old chat messages on mount
  useEffect(() => {
    if (!historyId) return;

    const existingChats = JSON.parse(localStorage.getItem("chats") || "[]");
    const chat = existingChats.find(
      (c) => c.id.toString() === historyId.toString()
    );

    if (chat) {
      setHistoryMessages(chat.messages || []);
    }
  }, [historyId]);

  // ✅ Keep updating with new streaming messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const existingChats = JSON.parse(localStorage.getItem("chats") || "[]");
    const chatIndex = existingChats.findIndex(
      (chat) => chat.id.toString() === historyId?.toString()
    );

    if (chatIndex !== -1) {
      const oldMessages = existingChats[chatIndex].messages || [];
      let mergedMessages = [...oldMessages];

      messages.forEach((msg) => {
        const last = mergedMessages[mergedMessages.length - 1];

        if (msg.role === "assistant" && last?.role === "assistant") {
          // ✅ Replace last assistant message (stream update)
          mergedMessages[mergedMessages.length - 1] = {
            ...last,
            content: msg.content,
          };
        } else if (
          !mergedMessages.some(
            (old) => old.content === msg.content && old.role === msg.role
          )
        ) {
          mergedMessages.push(msg);
        }
      });

      existingChats[chatIndex].messages = mergedMessages;
      localStorage.setItem("chats", JSON.stringify(existingChats));
      setHistoryMessages(mergedMessages); // ✅ update UI
    }
  }, [messages, historyId]);
const HandleCopy = (data) => {
    navigator.clipboard.writeText(data);
    window.alert("Copied to clipboard!");
  };
  useEffect(() => {
  if (scrolRef.current) {
    scrolRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [historyMessages]);

  return (
    <>
      <main>
        <div
          style={{
            display: historyMessages.length > 0 ? "block" : "none",
            paddingBottom: "52px",
          }}
          className="view conversation-view"
        >
          <div className="model-name">
            <i className="fa fa-bolt"></i> Ask or Let me Ask You Something
          </div>

          {historyMessages.map((data, index) => (
            <div key={index}>
              {data.role === "user" && (
                <div
                  style={{ justifyContent: "right", padding: "8px 12px 8px 1px" }}
                  className="user message"
                >
                  <div className="identity">
                    <i className="user-icon">u</i>
                  </div>
                  <div  className="content">
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
      onClick={()=>HandleCopy(data.content)}
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
  <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
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
              <div
                className="content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="typing-loader">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
                <button
                  style={{ padding: "7px", marginLeft: "28px" }}
                  onClick={() => stop()}
                  className="stop-btn"
                  title="Stop generating"
                >
                  ⏹
                </button>
              </div>
            </div>
          )}

          {error && (
            <div
              className="assistant message"
              style={{ justifyContent: "center", padding: "10px" }}
            >
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
          <button type="submit" className="send-button" disabled={isLoading}>
            <svg color="white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
</svg>
          </button>
        </div>
        <div className="disclaimer">
          This is a ChatGPT UI Clone for personal use and educational purposes only.
        </div>
      </form>
    </>
  );
}

export default History;
