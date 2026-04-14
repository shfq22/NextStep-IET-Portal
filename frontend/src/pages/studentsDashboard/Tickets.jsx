import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const Tickets = ({ data }) => {
  const [form, setForm] = useState({ subject: '', description: '' });
  const [lastTicket, setLastTicket] = useState(null);

  // Auto-dismiss success notification after 4 seconds
  useEffect(() => {
    if (lastTicket) {
      const timer = setTimeout(() => setLastTicket(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [lastTicket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = data.submitGrievance(form);
    setLastTicket(result);
    setForm({ subject: '', description: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase" style={{ color: 'var(--headline)' }}>Submit Grievance</h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Fill form, AI suggests category, then ticket is generated as GRV-YYYY-XXXX.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
        <input
          value={form.subject}
          onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
          className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent"
          style={{ color: 'var(--headline)' }}
          placeholder="Subject"
          required
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent"
          style={{ color: 'var(--headline)' }}
          placeholder="Describe your grievance"
          rows={4}
          required
        />
        <button
          type="submit"
          className="px-6 py-3 rounded font-bold text-xs uppercase tracking-widest"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Submit Grievance
        </button>
      </form>

      {lastTicket && (
        <div className="p-4 rounded border-2 border-green-500/50 bg-green-500/10 animate-pulse flex gap-3 items-start">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm text-green-700">✓ Grievance Submitted Successfully!</p>
            <p className="font-bold text-sm text-green-600 mt-2">Ticket ID: {lastTicket.ticketId}</p>
            <p className="text-sm text-green-600 mt-1">AI Suggested Category: {lastTicket.category}</p>
            <p className="text-xs text-green-500 mt-2 opacity-70">Your grievance is now visible in "My Grievances" below</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold mb-3" style={{ color: 'var(--headline)' }}>My Grievances ({data.grievances.length})</h3>
        <div className="space-y-3">
          {data.grievances.length === 0 && (
            <div className="p-4 rounded border border-[var(--tertiary)] text-sm opacity-70">No grievances submitted yet.</div>
          )}
          {data.grievances.map((g, idx) => (
            <div 
              key={g.id} 
              className={`p-4 rounded border transition-all ${
                idx === 0 && lastTicket ? 
                  'border-green-400/60 bg-green-50/20 shadow-md shadow-green-200/30' : 
                  'border-[var(--tertiary)] bg-[var(--bg-color)]'
              }`}
            >
              <div className="flex justify-between gap-3 items-start">
                <p className="font-bold flex-1" style={{ color: 'var(--headline)' }}>{g.subject}</p>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    g.status === 'Open' ? 'bg-blue-500/20 text-blue-700' : 
                    g.status === 'Resolved' ? 'bg-green-500/20 text-green-700' : 
                    'bg-gray-500/20 text-gray-700'
                  }`}>
                    {g.status}
                  </span>
                  {idx === 0 && lastTicket && <span className="text-xs bg-yellow-400/20 text-yellow-700 px-2 py-1 rounded font-bold">NEW</span>}
                </div>
              </div>
              <p className="text-xs mt-2 opacity-70">Ticket: {g.id} | Category: {g.category}</p>
              <p className="text-xs mt-1 opacity-60">Submitted: {g.createdAt}</p>
              {g.reply && <p className="text-sm mt-2 opacity-80 p-2 rounded bg-blue-50/30"><strong>Reply:</strong> {g.reply}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tickets;