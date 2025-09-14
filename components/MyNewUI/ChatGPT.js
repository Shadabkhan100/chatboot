"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react"; // ✅ using your API logic
import { usePathname, useParams } from "next/navigation";
import SaveChat from "./SaveChat";
import NewActivity from "./NewActivity";
import History from "./History";
import "./style.css"
export default function ChatGPT({chatID,setMyMessages  ,id}) {

  const [sidebarHidden, setSidebarHidden] = useState(true);
    const [savedChats, setSavedChats] = useState([]);
   

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    setSavedChats(chats);

    // find the chat that matches the ID
    const found = chats.find((chat) => String(chat.id) === String(id));
    setMyMessages (found ? found.messages : []);
  }, [id]);
  // ✅ useChat hook (from your page2)
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    
    error
  } = useChat({ api: "/api/gemini" });

  const scrolRef = useRef();




  // ✅ User menu toggle logic (your original code kept intact)
  useEffect(() => {
    const user_menu = document.querySelector(".user-menu ul");
    const show_user_menu = document.querySelector(".user-menu button");

    if (user_menu && show_user_menu) {
      const toggleMenu = () => {
        if (user_menu.classList.contains("show")) {
          user_menu.classList.remove("show");
          setTimeout(() => user_menu.classList.remove("show-animate"), 200);
        } else {
          user_menu.classList.add("show-animate");
          setTimeout(() => user_menu.classList.add("show"), 50);
        }
      };

      show_user_menu.addEventListener("click", toggleMenu);
      return () => show_user_menu.removeEventListener("click", toggleMenu);
    }
  }, []);


const saveChatlaptop = () => {
  // clear the "current chat" by redirecting to home
  window.location.href = "/";

  
};


  const pathname = usePathname();
  const params = useParams() ;

  const isHistoryRoute = pathname.startsWith("/history");


  // inside ChatGPT component

const deleteChat = (id) => {
  // 1. Get existing chats
  const existingChats = JSON.parse(localStorage.getItem("chats") || "[]");
  const updatedChats = existingChats.filter((chat) => chat.id !== id);
  localStorage.setItem("chats", JSON.stringify(updatedChats));
window.location.reload()
  // 5. If user is viewing the deleted chat, redirect to home
  if (params?.id?.toString() === id.toString()) {
    window.location.href = "/";
  }
};


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
        mergedMessages[mergedMessages.length - 1] = { ...last, content: msg.content };
      } else if (
        !mergedMessages.some(
          (old) => old.content === msg.content && old.role === msg.role
        )
      ) {
        // ✅ Add only new user/assistant messages
        mergedMessages.push(msg);
      }
    });

    existingChats[chatIndex].messages = mergedMessages;
    localStorage.setItem("chats", JSON.stringify(existingChats));
    setHistoryMessages(mergedMessages); // ✅ update UI
  }
}, [messages, chatID]);



  return (
    <>
      <nav id="sidebar" className={sidebarHidden ? "hidden" : ""}>
        <div className="float-top">
          <div className="sidebar-controls">
            <button onClick={saveChatlaptop} className="new-chat">
              <i className="fa fa-plus"></i> New Chat
            </button>
            <button
              className="hide-sidebar"
              onClick={() => setSidebarHidden((prev) => !prev)}
            >
             <svg color="white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filter-right" viewBox="0 0 16 16">
  <path d="M14 10.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5m0-3a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0 0 1h11a.5.5 0 0 0 .5-.5"/>
</svg>
            </button>
          </div>
          <ul className="conversations">
            <li className="grouping">Today</li>

            {savedChats.map((chat) => (
              <li key={chat.id}>
                <button
                  className="conversation-button"
                  onClick={() => window.location.href = `/history/${chat.id}`}
                >
                  <i className="fa fa-message fa-regular"></i>{" "}
                  {chat.title.slice(0, 25)} {/* 👈 shorten title */}
                </button>
                <div className="fade"></div>
                <div className="edit-buttons">
                  <button><i className="fa fa-edit"></i></button>
                  <button onClick={() => deleteChat(chat.id)}><i className="fa fa-trash"></i></button>
                </div>
              </li>
            ))}
          </ul>

        </div>
        <div className="user-menu">
          <button>
            <i className="user-icon">u</i> username <i className="fa fa-ellipsis dots"></i>
          </button>
          <ul>
            <li><button>My plan</button></li>
            <li><button>Custom instructions</button></li>
            <li><button>Settings & Beta</button></li>
            <li><button>Log out</button></li>
          </ul>
        </div>
      </nav>

      <div className="myMobHeader"> <span id="mySpan">NamelianGPT</span>
        <SaveChat messages={messages} />
      </div>
      {chatID && isHistoryRoute ? (
        // ✅ Show History component if on /history/:id
        <History isHistoryRoute={isHistoryRoute} handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange}  scrolRef={scrolRef} error={error} isLoading={isLoading} messages={messages} historyId={params.id} chatID={chatID}/>
      ) : (
        <NewActivity isHistoryRoute={isHistoryRoute} handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} isLoading={isLoading} scrolRef={scrolRef} error={error}  messages={messages} chatID={chatID}/>
      )}

      {/* Input box with send button */}
      
    </>
  );
}
