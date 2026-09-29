import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export const Chatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    {
      role: 'assistant',
      text: "Hello! I'm FanBot, your Fan Hub Plus guide. Ask me about fandom categories, character abilities, upcoming releases with live countdowns, conventions, or how to submit your own fan creations!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = (overrideText || input).trim();
    if (!textToSend || loading) return;

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: messages.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: "I'm having a brief connection hitch. Please ask again!" }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Unable to reach the fandom universe server. Please verify your connection." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What upcoming releases are coming?",
    "Explain all 8 fandom categories",
    "How does the merchandise showcase work?",
    "How can I submit fan articles?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 text-white shadow-xl shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95"
          aria-label="Open AI Assistant"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          {/* Subtle online pulse */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-indigo-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  FanBot AI
                  <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[9px] font-semibold text-rose-400">
                    Grounded
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">Your Fandom Universe Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      role: 'assistant',
                      text: "Chat refreshed! How can I assist your fandom journey?"
                    }
                  ])
                }
                title="Restart chat"
                className="rounded p-1 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 text-xs ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-500/20 text-rose-400">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-xl px-3 py-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-750 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                {m.role === 'user' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 text-slate-300">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-500/20 text-rose-400">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-850 px-3 py-2 text-[11px] italic">
                  Scanning database & lore archives...
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="border-t border-slate-800/60 bg-slate-950/40 p-2 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center border-t border-slate-800 bg-slate-950 p-2.5 gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about anime, games, conventions..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white transition-all hover:bg-rose-500 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
