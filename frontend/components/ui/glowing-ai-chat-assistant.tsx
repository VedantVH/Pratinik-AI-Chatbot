"use client";

import React, { useState, useRef, useEffect } from "react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { X, MessageCircleHeart, RefreshCw, Smile, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  tag?: string;
  confidence?: number;
  timestamp: Date;
}

const QUICK_REPLIES = [
  "Track my order 📦",
  "Request a refund 💰",
  "Talk to an agent 🧑‍💼",
  "Payment issue 💳",
];

const TYPING_PHRASES = ["Typing", "Checking", "Thinking"];

// Typing effect component for bot messages
const StreamingText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const words = text.split(" ");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayedText(words.slice(0, i + 1).join(" "));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPhrase, setTypingPhrase] = useState(TYPING_PHRASES[0]);
  const [isOnline, setIsOnline] = useState(true);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Rotate typing phrase
  useEffect(() => {
    if (!isTyping) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % TYPING_PHRASES.length;
      setTypingPhrase(TYPING_PHRASES[idx]);
    }, 600);
    return () => clearInterval(interval);
  }, [isTyping]);

  // Check backend health
  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((r) => (r.ok ? setIsOnline(true) : setIsOnline(false)))
      .catch(() => setIsOnline(false));
  }, [isOpen]);

  // Greet on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: Math.random().toString(36).substr(2, 9),
            role: "bot",
            text: "Hi there! 👋 I'm your Pratinik Support Assistant. How can I brighten your day and help you out?",
            tag: "greeting",
            confidence: 1,
            timestamp: new Date(),
          },
        ]);
      }, 800);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#6366f1", "#10b981"],
    });
  };

  const handleSend = async (overrideText?: string) => {
    const text = overrideText ?? message;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch(`http://127.0.0.1:8000/chat?query=${encodeURIComponent(text.trim())}`);
      const data = await res.json();

      // Trigger confetti on success intents
      if (data.tag === "order_status" || data.tag === "refund" || data.tag === "payment") {
        setTimeout(fireConfetti, 1000);
      }

      // Realistic delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: "bot",
          text: data.response,
          tag: data.tag,
          confidence: data.confidence,
          timestamp: new Date(),
        },
      ]);
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          role: "bot",
          text: "Oops! It seems I can't reach my server right now. Let's try again in a moment. 🛠️",
          tag: "error",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleClear = () => {
    setMessages([]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        {
          id: Math.random().toString(36).substr(2, 9),
          role: "bot",
          text: "Fresh start! What can I assist you with now? 😊",
          tag: "greeting",
          confidence: 1,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* ── GOD LEVEL Floating Trigger Button ──────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full",
              "bg-blue-600 text-white shadow-[0_8px_30px_rgb(37,99,235,0.4)]",
              "focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            )}
          >
            <MessageCircleHeart className="h-7 w-7" />
            <span className="absolute -inset-2 rounded-full border border-blue-500/50 animate-ping [animation-duration:3s]" />
            <span
              className={cn(
                "absolute top-0 right-0 h-4 w-4 rounded-full border-2 border-white",
                isOnline ? "bg-green-500" : "bg-slate-400"
              )}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── GOD LEVEL Chat Panel with Spring Physics ────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex flex-col",
              "w-[400px] rounded-[32px] overflow-hidden",
              "bg-white/90 backdrop-blur-2xl border border-white",
              "shadow-[0_20px_80px_-10px_rgba(0,0,0,0.15)]"
            )}
            style={{ height: "680px", maxHeight: "calc(100vh - 48px)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 bg-white/50 border-b border-slate-100 shrink-0">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm"
              >
                <Smile className="h-6 w-6" />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2.5px] border-white bg-green-500" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-slate-800 leading-none tracking-tight">Support AI</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[13px] text-slate-500 leading-none font-semibold">Online now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ rotate: 180 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={handleClear}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#fee2e2", color: "#ef4444" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white scrollbar-none"
            >
              <AnimatePresence initial={false}>
                {messages.length === 0 && !isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center gap-4"
                  >
                    <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                      <Sparkles className="h-10 w-10 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">How can I help?</h3>
                    <p className="text-slate-500 font-medium">Ask about orders, refunds, or agents.</p>
                  </motion.div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {msg.role === "bot" && (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                        <Smile className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div className={cn("flex flex-col gap-1.5 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                      <motion.div
                        layout
                        className={cn(
                          "px-4 py-3 text-[15px] leading-relaxed shadow-sm font-medium",
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-[22px] rounded-tr-[4px]"
                            : "bg-white border border-slate-100 text-slate-800 rounded-[22px] rounded-tl-[4px]"
                        )}
                      >
                        {msg.role === "bot" ? <StreamingText text={msg.text} /> : msg.text}
                      </motion.div>
                      <span className="text-[10px] font-bold text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Smile className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-full px-4 py-3 flex gap-1.5 shadow-sm">
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-4 bg-white/80 border-t border-slate-100 shrink-0 flex gap-2 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map((qr) => (
                <motion.button
                  key={qr}
                  whileHover={{ y: -3, backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(qr)}
                  className="flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full bg-slate-50 text-slate-600 border border-slate-200 transition-colors whitespace-nowrap"
                >
                  {qr}
                </motion.button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-6 pb-6 pt-2 bg-white shrink-0">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-[24px] p-2 focus-within:bg-white focus-within:shadow-xl focus-within:border-blue-300 transition-all">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type here..."
                  className="flex-1 resize-none bg-transparent text-[15px] text-slate-800 placeholder-slate-400 outline-none py-2.5 px-3 font-semibold min-h-[44px] max-h-[120px] scrollbar-none"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                  <LiquidButton
                    onClick={() => handleSend()}
                    disabled={!message.trim() || isTyping}
                    className="!h-11 !w-11 !rounded-2xl !p-0 bg-blue-600 text-white flex items-center justify-center disabled:opacity-50"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </LiquidButton>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
