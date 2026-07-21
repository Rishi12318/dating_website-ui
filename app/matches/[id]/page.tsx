"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

interface Message {
  id: string;
  sender: string;
  sender_email: string;
  content: string;
  message_type: string;
  created_at: string;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !matchId) return;
    api.getMessages(matchId)
      .then((data: unknown) => setMessages(Array.isArray(data) ? data : (data as { results: Message[] }).results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      const msg = await api.sendMessage(matchId, newMessage.trim()) as Message;
      setMessages((prev) => [...prev, msg]);
      setNewMessage("");
      setShowSuggestions(false);
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGetSuggestions = async () => {
    try {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg) {
        const res = await api.suggestReply(lastMsg.id) as { suggestions?: string[] };
        setSuggestions(res.suggestions || []);
        setShowSuggestions(true);
      }
    } catch {
      // ignore
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
        <div className="text-rose-500 text-lg animate-pulse">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white/70 backdrop-blur border-b border-white/40">
        <button onClick={() => router.push("/matches")} className="p-1 hover:bg-rose-50 rounded-full transition">
          ←
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800">Chat</h2>
        </div>
        <button onClick={handleGetSuggestions} title="AI reply suggestions"
          className="p-2 rounded-full bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 transition text-sm">
          ✨
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-gray-500 text-sm">Say hello! Break the ice.</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender === user?.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isMine
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md"
                  : "bg-white/80 text-gray-800 border border-white/40 shadow-sm rounded-bl-md"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="px-4 py-2 bg-white/60 backdrop-blur border-t border-white/40">
          <p className="text-xs text-gray-500 mb-2">✨ AI Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => { setNewMessage(s); setShowSuggestions(false); }}
                className="text-xs bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-pink-100 transition">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 bg-white/70 backdrop-blur border-t border-white/40">
        <div className="flex gap-2 items-end">
          <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Type a message..." rows={1}
            className="flex-1 rounded-2xl border border-gray-200 focus:border-pink-400 focus:ring-pink-400 px-4 py-2.5 bg-white/70 resize-none text-sm" />
          <button onClick={handleSend} disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 disabled:opacity-50 transition flex-shrink-0">
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
