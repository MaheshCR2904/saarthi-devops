"use client";

import { useState, useEffect, useRef } from "react";
import { useSaarthi } from "@/components/SaarthiProvider";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "saarthi";
  content: string;
  timestamp: Date;
}

const STARTER_QUESTIONS = [
  "What career path fits my profile best?",
  "I'm feeling confused about what to do next",
  "How can I improve my skills for better opportunities?",
  "Analyze my profile and give me life advice",
  "I had a setback — help me recalculate",
  "What's my projected salary in 5 years?",
];

export default function SaarthiGuidePage() {
  const { user } = useSaarthi();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ai-chat")
      .then((r) => r.json())
      .then((data) => {
        if (data.conversations?.length > 0) {
          setMessages(
            data.conversations.flatMap(
              (c: { message: string; response: string; createdAt: string }) => [
                { id: `u-${c.createdAt}`, role: "user" as const, content: c.message, timestamp: new Date(c.createdAt) },
                { id: `s-${c.createdAt}`, role: "saarthi" as const, content: c.response, timestamp: new Date(c.createdAt) },
              ]
            )
          );
        } else {
          setMessages([
            {
              id: "welcome",
              role: "saarthi",
              content: `Namaste ${user?.name?.split(" ")[0] || "there"}! 🙏 I'm Saarthi — your lifelong guide. I know your entire journey: every milestone, every struggle, every win. And I never judge — I only recalculate.\n\nHow are you feeling today? What's on your mind?`,
              timestamp: new Date(),
            },
          ]);
        }
      });
  }, [user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: `u-${crypto.randomUUID()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, contextType: "chat" }),
      });
      const data = await res.json();

      const saarthiMsg: Message = {
        id: `s-${crypto.randomUUID()}`,
        role: "saarthi",
        content: data.response || "I'm here with you. Let's continue our conversation.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, saarthiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `s-error-${crypto.randomUUID()}`,
          role: "saarthi",
          content: "I'm having a moment. Please try again — I'm still here for you. 💙",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-amber border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
          Saarthi is listening
        </div>
        <h1 className="text-3xl font-black font-[Outfit] text-white">Your AI Life Guide 🧘</h1>
        <p className="text-slate-400 text-sm mt-1">
          A wise companion that remembers your entire journey and recalculates without judgment
        </p>
      </div>

      {/* Chat Container */}
      <div className="glass-strong rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Messages list */}
        <div className="h-[480px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl p-4 shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none"
                    : "glass border border-white/10 text-slate-200 rounded-bl-none"
                }`}
              >
                {msg.role === "saarthi" && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">🛞</span>
                    <span className="text-xs font-bold text-amber-400">Saarthi</span>
                  </div>
                )}
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[10px] opacity-40 mt-1.5 text-right">
                  {msg.timestamp.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 border border-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Questions */}
        {messages.length <= 1 && (
          <div className="px-6 pb-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Try asking...</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 text-xs glass border border-white/8 rounded-full text-slate-300 hover:text-white hover:border-amber-500/30 transition-all font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-white/8 p-4 glass">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="input-premium flex-1 px-4 py-3 rounded-xl text-sm"
              disabled={loading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-premium px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              Send →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <Link
          href="/career"
          className="p-3.5 glass rounded-xl border border-white/8 text-center text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-500/30 transition-all"
        >
          💼 Career Predictions
        </Link>
        <Link
          href="/simulator"
          className="p-3.5 glass rounded-xl border border-white/8 text-center text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-500/30 transition-all"
        >
          🔮 What-If Simulator
        </Link>
        <Link
          href="/recovery"
          className="p-3.5 glass rounded-xl border border-white/8 text-center text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-500/30 transition-all"
        >
          🔄 Setback Recovery
        </Link>
      </div>
    </div>
  );
}
