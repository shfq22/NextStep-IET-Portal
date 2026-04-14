import React, { useState } from 'react';

const draftReply = (grievance) =>
  `Thank you for raising "${grievance.subject}". We reviewed the issue under ${grievance.category} and started resolution.`;

const AdminGrievances = ({ data }) => {
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState('In Progress');

  const onOpen = (item) => {
    setSelected(item);
    setReplyText(draftReply(item));
    setStatus(item.status === 'Open' ? 'In Progress' : item.status);
  };

  const onSend = () => {
    if (!selected) return;
    data.updateGrievance(selected.id, { reply: replyText, status });
    setSelected(null);
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase">Pending Grievances</h2>
        <p className="text-sm mt-2 opacity-70">Open grievance, review AI draft reply, edit and send, then update status.</p>
      </div>

      <div className="space-y-3">
        {data.grievances.length === 0 && <div className="p-4 rounded border border-[var(--tertiary)]">No grievances submitted yet.</div>}
        {data.grievances.map((g) => (
          <div key={g.id} className="p-4 rounded border border-[var(--tertiary)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="font-bold">{g.subject}</p>
              <p className="text-xs opacity-70">Ticket: {g.id} | AI Category: {g.category} | Status: {g.status}</p>
            </div>
            <button
              onClick={() => onOpen(g)}
              className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Open
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)] space-y-3">
          <p className="font-bold">Replying to {selected.id}</p>
          <textarea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent">
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
          <button
            onClick={onSend}
            className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            Send Reply
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminGrievances;
