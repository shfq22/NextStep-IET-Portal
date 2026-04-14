import React, { useState, useEffect } from 'react';
import { getAllDocTickets, getForumPosts } from '../../api/api';

const AdminHome = ({ data }) => {
  const [docTicketCount, setDocTicketCount] = useState(0);
  const [pendingTickets, setPendingTickets] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [unresolvedForumCount, setUnresolvedForumCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docRes, forumRes] = await Promise.all([
          getAllDocTickets(),
          getForumPosts(),
        ]);
        const tickets = docRes.data.tickets || [];
        setDocTicketCount(tickets.length);
        setPendingTickets(tickets.filter(t => t.status !== 'All Verified').length);

        const posts = forumRes.data.posts || [];
        setForumCount(posts.length);
        setUnresolvedForumCount(posts.filter(p => !p.resolved).length);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase" style={{ color: 'var(--headline)' }}>Volunteer / Admin Dashboard</h2>
        <p className="text-sm mt-2 opacity-70">Manage grievances, scholarship verifications, and announcements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Pending Grievances</p>
          <p className="text-3xl font-black mt-1">{data.grievances.filter((g) => g.status !== 'Resolved').length}</p>
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Scholarship Applications</p>
          <p className="text-3xl font-black mt-1">{data.scholarshipApplications.length}</p>
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Doc Tickets</p>
          <p className="text-3xl font-black mt-1">{docTicketCount}</p>
          {pendingTickets > 0 && (
            <p className="text-xs mt-1 text-yellow-600 font-bold">{pendingTickets} need review</p>
          )}
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Forum Queries</p>
          <p className="text-3xl font-black mt-1">{forumCount}</p>
          {unresolvedForumCount > 0 && (
            <p className="text-xs mt-1 text-yellow-600 font-bold">{unresolvedForumCount} unresolved</p>
          )}
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Announcements Posted</p>
          <p className="text-3xl font-black mt-1">{data.announcements.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
