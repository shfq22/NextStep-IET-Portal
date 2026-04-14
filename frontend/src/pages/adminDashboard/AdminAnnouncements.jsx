import React, { useState } from 'react';

const AdminAnnouncements = ({ data }) => {
  const [form, setForm] = useState({ title: '', body: '', target: 'All' });

  const handleSubmit = (e) => {
    e.preventDefault();
    data.postAnnouncement(form);
    setForm({ title: '', body: '', target: 'All' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase">Announcements</h2>
        <p className="text-sm mt-2 opacity-70">Write announcement, choose target (All/Branch/Year), and post instantly to student dashboard.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
        <input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
          placeholder="Announcement title"
          required
        />
        <textarea
          rows={4}
          value={form.body}
          onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
          className="w-full px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
          placeholder="Announcement details"
          required
        />
        <select
          value={form.target}
          onChange={(e) => setForm((prev) => ({ ...prev, target: e.target.value }))}
          className="px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
        >
          <option>All</option>
          <option>Branch</option>
          <option>Year</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Post
        </button>
      </form>

      <div className="space-y-2">
        {data.announcements.map((item) => (
          <div key={item.id} className="p-4 rounded border border-[var(--tertiary)]">
            <p className="font-bold">{item.title}</p>
            <p className="text-sm opacity-80 mt-1">{item.body}</p>
            <p className="text-xs opacity-60 mt-2">Target: {item.target} | {item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
