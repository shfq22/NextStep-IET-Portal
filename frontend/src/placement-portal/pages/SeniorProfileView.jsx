import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ExternalLink, Link2 } from 'lucide-react';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function SeniorProfileView() {
  const { id } = useParams();
  const { seniors, studentUser, sendReferralRequest } = usePlacement();
  const senior = seniors.find((s) => s.id === id);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  if (!studentUser) {
    return <Navigate to="/placement/student" replace />;
  }
  if (!senior) {
    return (
      <PlacementShell showStudentNav>
        <p className="text-center py-20 opacity-60">Profile not found.</p>
      </PlacementShell>
    );
  }

  const defaultNote = `Hi ${senior.name}, I'm interested in roles at ${senior.company} (${senior.role}). I'd appreciate a referral if you're open.`;

  const submitReferral = (e) => {
    e.preventDefault();
    sendReferralRequest({
      seniorId: senior.id,
      message: note || defaultNote,
      studentEmail: studentUser.email,
      studentName: studentUser.name,
    });
    setOpen(false);
    setNote('');
    alert('Referral request sent. The senior will see it in their inbox on this portal.');
  };

  return (
    <PlacementShell showStudentNav>
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <Link to="/placement/student/discover" className="text-xs font-bold opacity-60 hover:opacity-100">
          ← Back to discovery
        </Link>
        <div className="rounded-2xl border border-[var(--tertiary)] overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }}>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
            <img src={senior.photoUrl} alt="" className="w-28 h-28 rounded-2xl object-cover bg-[var(--tertiary)] shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black" style={{ color: 'var(--headline)' }}>
                {senior.name}
              </h1>
              <p className="text-sm opacity-70">{senior.headline}</p>
              <p className="text-lg font-bold mt-3" style={{ color: 'var(--headline)' }}>
                {senior.company} · {senior.role}
              </p>
              <p className="text-xs uppercase tracking-widest opacity-50 mt-1">
                Placed {senior.offerYear} · {senior.placementType}
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                <a
                  href={senior.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: '#0a66c2', color: '#fff' }}
                >
                  <Link2 size={16} />
                  Connect on LinkedIn
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setNote(defaultNote);
                    setOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                >
                  Request referral
                </button>
              </div>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest opacity-50 mb-3">Interview journey</h2>
          <ul className="space-y-3">
            {senior.rounds.map((r, i) => (
              <li key={i} className="rounded-xl border border-[var(--tertiary)] p-4 text-sm" style={{ backgroundColor: 'var(--secondary)' }}>
                <strong style={{ color: 'var(--headline)' }}>{r.name}</strong>
                <p className="opacity-80 mt-1">{r.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-widest opacity-50 mb-3">Tips &amp; prep</h2>
          <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">{senior.tips}</p>
        </section>

        {senior.resources?.length > 0 && (
          <section>
            <h2 className="text-sm font-black uppercase tracking-widest opacity-50 mb-3">Resources</h2>
            <ul className="space-y-2">
              {senior.resources.map((res, i) => (
                <li key={i}>
                  <a href={res.url} className="text-sm font-bold inline-flex items-center gap-1 hover:underline" style={{ color: 'var(--headline)' }}>
                    {res.label} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--tertiary)] p-6 shadow-xl" style={{ backgroundColor: 'var(--bg-color)' }}>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--headline)' }}>
              Referral request
            </h3>
            <p className="text-xs opacity-60 mb-4">
              Context: <strong>{senior.name}</strong> · {senior.company} · {senior.role}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-[var(--tertiary)] bg-transparent p-3 text-sm"
              style={{ color: 'var(--headline)' }}
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-xs font-bold opacity-60">
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReferral}
                className="px-4 py-2 rounded-lg text-xs font-bold"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </PlacementShell>
  );
}
