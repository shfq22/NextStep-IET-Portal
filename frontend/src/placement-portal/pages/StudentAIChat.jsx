import React, { useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';
import { getPlacementAiReply } from '../aiResponder';

export default function StudentAIChat() {
  const { studentUser } = usePlacement();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! I'm your placement mentor. Ask about companies, rounds, off-campus, referrals — I summarize what seniors shared on this portal.",
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  if (!studentUser) {
    return <Navigate to="/placement/student" replace />;
  }

  const send = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setTimeout(() => {
      const reply = getPlacementAiReply(q);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
  };

  return (
    <PlacementShell showStudentNav>
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col min-h-[70vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle size={22} style={{ color: 'var(--headline)' }} />
            <h1 className="text-xl font-black" style={{ color: 'var(--headline)' }}>
              AI doubt resolver
            </h1>
          </div>
          <Link to="/placement/student/discover" className="text-xs font-bold opacity-60">
            Discovery
          </Link>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'ml-auto' : 'mr-auto'
              }`}
              style={{
                backgroundColor: msg.role === 'user' ? 'var(--btn-bg)' : 'var(--secondary)',
                color: msg.role === 'user' ? 'var(--btn-text)' : 'var(--headline)',
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. "How many rounds does Google SWE have?"'
            className="flex-1 rounded-xl border border-[var(--tertiary)] bg-transparent px-4 py-3 text-sm"
            style={{ color: 'var(--headline)' }}
          />
          <button
            type="submit"
            className="px-4 rounded-xl font-bold"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] opacity-40 mt-3 text-center">Demo assistant uses on-portal senior data only — not a live LLM.</p>
      </div>
    </PlacementShell>
  );
}
