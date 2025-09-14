"use client";

import LandingSections from "@/components/LandingSections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, MessageCircle, Send, Loader2, ArrowDownCircleIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import reactMarkDown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setShowChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const {
    messages, input, handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    reload,
    error
  } = useChat({ api: '/api/gemini' })
  const scrolRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowChatIcon(true);
      } else {
        setShowChatIcon(false);
        setIsChatOpen(false);
      }
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  useEffect(() => {
    if (scrolRef.current) {
      scrolRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen">
      <LandingSections />
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Button onClick={toggleChat} ref={chatIconRef} size={'icon'} className="rounded-full size-14 text-white shadow-lg p-2">
              {!isChatOpen ? (
                <MessageCircle className="w-6 h-6" />

              ) : (
                <ArrowDownCircleIcon />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 z-50 w-[95%] md:w-[400px]"
          >
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold">
                  Chat with Noteworthy AI
                </CardTitle>
                <Button
                  onClick={toggleChat}
                  size="icon"
                  variant="ghost"
                  className="px-2 py-0"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="flex flex-col gap-2">
                    {/* All messages */}
                    {messages.length === 0 && (
                      <div className="w-full mt-32 text-gray-502 items-center justify-center flex gap-3">
                        No Message Yet
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <div style={{padding: '0.5rem'}}
                        key={index}
                        className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block rounded-lg ${message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                            } p-2 max-w-[90%]`}
                        >
                          <ReactMarkdown
                           
                            children={message.content}
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({ node, inline, className, children, ...props }) {
                                return inline ? (
                                  <code className="bg-gray-200 px-1 rounded " {...props} style={{marginTop: '0.5rem'}}>
                                    {children}
                                  </code>
                                ) : (
                                  <pre style={{marginTop: '0.5rem'}} className="bg-gray-200 p-2 rounded " {...props}>
                                    <code>{children}</code>
                                  </pre>
                                );
                              },
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="w-full items-center flex justify-center gap-3">
                        <Loader2 className="animate-spin h-5 w-5 text-primary" />
                        <button
                          
                          type="button"
                          onClick={() => stop()}
                        >
                          <span>Generating Response.....</span>
                        </button>
                      </div>
                    )}
                    {error && (
                      <div className="w-full items-center flex justify-center gap-3">
                        <div>An error occurred.</div>
                        <button
                          className="underline"
                          type="button"
                          onClick={() => reload()}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* This must be inside the actual scrolling element */}
                    <div ref={scrolRef} />
                  </div>
                </ScrollArea>

              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit}
                  className="flex w-full items-center space-x-2"
                >
                  <Input onChange={handleInputChange} placeholder="Enter your message" value={input} className="flex-1 mt-2 mb-1">

                  </Input>
                  <Button size="icon" type="submit" className="size-9" disabled={isLoading}>
                    <Send className="size-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>


        )}

      </AnimatePresence>
    </div>
  );
}
