import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function AlumniProfilePage() {
  const { alumniUser, referrals, updateReferral, seniors } = usePlacement();
  const [replyDraft, setReplyDraft] = useState({});

  if (!alumniUser) {
    return <Navigate to="/placement/alumni" replace />;
  }
  if (!alumniUser.profileComplete) {
    return <Navigate to="/placement/alumni/onboarding" replace />;
  }

  const setReply = (id, text) => setReplyDraft((d) => ({ ...d, [id]: text }));

  const mySenior = seniors.find((s) => s.id === alumniUser.id);
  const inbox = referrals.filter((r) => r.seniorId === alumniUser.id);

  const display = mySenior || {
    name: alumniUser.name,
    headline: alumniUser.headline,
    company: alumniUser.company,
    role: alumniUser.role,
    photoUrl: alumniUser.photoUrl,
    linkedInUrl: alumniUser.linkedInUrl,
    tips: alumniUser.tips,
    rounds: alumniUser.rounds || [],
    resources: alumniUser.resources || [],
    offerYear: alumniUser.offerYear,
    placementType: alumniUser.placementType,
  };

  return (
    <PlacementShell showAlumniNav>
      <div className="max-w-4xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-[var(--tertiary)] overflow-hidden" style={{ backgroundColor: 'var(--secondary)' }}>
            <img src={display.photoUrl} alt="" className="w-full aspect-square object-cover bg-[var(--tertiary)]" />
            <div className="p-4">
              <h2 className="font-bold text-lg" style={{ color: 'var(--headline)' }}>
                {display.name}
              </h2>
              <p className="text-xs opacity-70">{display.headline}</p>
              <p className="text-sm font-bold mt-2" style={{ color: 'var(--headline)' }}>
                {display.company} · {display.role}
              </p>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
                {display.offerYear} · {display.placementType}
              </p>
              <a
                href={display.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold"
                style={{ color: 'var(--headline)' }}
              >
                LinkedIn <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest opacity-50 mb-3">Referral inbox</h3>
            <p className="text-xs opacity-60 mb-4">Requests appear only on your profile — accept, reply, or decline.</p>
            <div className="space-y-4">
              {inbox.length === 0 && (
                <p className="text-sm opacity-50 py-8 border border-dashed border-[var(--tertiary)] rounded-xl text-center">
                  No referral requests yet.
                </p>
              )}
              {inbox.map((r) => (
                <div key={r.id} className="rounded-xl border border-[var(--tertiary)] p-4" style={{ backgroundColor: 'var(--secondary)' }}>
                  <div className="flex justify-between gap-2 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: 'var(--headline)' }}>
                      {r.studentName}
                    </p>
                    <span className="text-[10px] font-bold uppercase opacity-50">{r.status}</span>
                  </div>
                  <p className="text-xs opacity-50 mt-1">{r.createdAt}</p>
                  <p className="text-sm mt-3 whitespace-pre-wrap opacity-90">{r.message}</p>
                  {r.seniorReply && (
                    <p className="text-sm mt-2 p-2 rounded bg-[var(--bg-color)] border border-[var(--tertiary)]">You: {r.seniorReply}</p>
                  )}
                  {r.status === 'pending' && (
                    <div className="mt-4 space-y-2">
                      <textarea
                        value={replyDraft[r.id] || ''}
                        onChange={(e) => setReply(r.id, e.target.value)}
                        placeholder="Reply to student…"
                        rows={2}
                        className="w-full text-sm rounded-lg border border-[var(--tertiary)] bg-transparent p-2"
                        style={{ color: 'var(--headline)' }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateReferral(r.id, {
                              status: 'accepted',
                              seniorReply: replyDraft[r.id] || 'Accepted — I will refer you.',
                            })
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                        >
                          Accept &amp; respond
                        </button>
                        <button
                          type="button"
                          onClick={() => updateReferral(r.id, { status: 'replied', seniorReply: replyDraft[r.id] || 'Reply sent.' })}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--tertiary)]"
                          style={{ color: 'var(--headline)' }}
                        >
                          Reply only
                        </button>
                        <button type="button" onClick={() => updateReferral(r.id, { status: 'declined' })} className="px-3 py-1.5 rounded-lg text-xs font-bold opacity-60">
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-black uppercase tracking-widest opacity-50 mb-3">Live profile preview</h3>
            <p className="text-sm opacity-80 whitespace-pre-wrap">{display.tips}</p>
            <ul className="mt-4 space-y-2">
              {(display.rounds || []).map((round, i) => (
                <li key={i} className="text-sm border-l-2 border-[var(--btn-bg)] pl-3">
                  <strong>{round.name}</strong> — {round.detail}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PlacementShell>
  );
}
