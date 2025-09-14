"use client";

import ChatGPT from "@/components/MyNewUI/ChatGPT";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../../components/MyNewUI/style.css";

export default function Page() {
  const { id } = useParams(); // ✅ get the /history/:id param
  const [savedChats, setSavedChats] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chats = JSON.parse(localStorage.getItem("chats") || "[]");
    setSavedChats(chats);

console.log(messages);
    // find the chat that matches the ID
    const found = chats.find((chat) => String(chat.id) === String(id));
    setMessages(found ? found.messages : []);
  }, [id]);
  const setMyMessages = (messages) => {
    setMessages(messages);
  };
  return (
    <>
      <ChatGPT setMyMessages={setMyMessages}  id={id} savedChats={savedChats} chatID={id} />
     
    </>
  );
}
