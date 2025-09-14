"use client";
import ChatGPT from '@/components/MyNewUI/chatGPT'
import React, { useEffect,useState } from 'react'
import { useParams } from "next/navigation";

import "../components/MyNewUI/style.css";

function page() {
 const [savedChats, setSavedChats] = useState([]);
  const [messages, setMessages] = useState([]);
 const { id } = useParams();
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
      <ChatGPT setMyMessages={setMyMessages}   savedChats={savedChats} />
    </>
  )
}

export default page