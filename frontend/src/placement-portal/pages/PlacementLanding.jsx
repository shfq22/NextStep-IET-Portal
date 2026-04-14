import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, UserCircle, ArrowRight } from 'lucide-react';

export default function PlacementLanding() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.25em] opacity-50 mb-4">Placement Portal</p>
      <h1 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--headline)' }}>
        Learn from seniors. Ask AI. Request referrals.
      </h1>
      <p className="text-sm opacity-75 max-w-lg mx-auto mb-12 leading-relaxed">
        Separate from DSW — this space is only for placements: alumni share journeys, students discover profiles, and referral
                            requests stay on each senior’s inbox.
      </p>
      <div className="grid sm:grid-cols-2 gap-6 text-left">
        <Link
          to="/placement/student"
          className="group p-8 rounded-2xl border border-[var(--tertiary)] transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <GraduationCap className="mb-4" size={32} style={{ color: 'var(--headline)' }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--headline)' }}>
            I’m a student
          </h2>
          <p className="text-sm opacity-70 mb-4">Search or browse seniors, read tips, use the AI mentor, send referral requests.</p>
          <span className="text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Continue <ArrowRight size={14} />
          </span>
        </Link>
        <Link
          to="/placement/alumni"
          className="group p-8 rounded-2xl border border-[var(--tertiary)] transition-all hover:shadow-md"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <UserCircle className="mb-4" size={32} style={{ color: 'var(--headline)' }} />
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--headline)' }}>
            I’m alumni
          </h2>
          <p className="text-sm opacity-70 mb-4">Link LinkedIn (demo), publish your placement story, manage referral inbox.</p>
          <span className="text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Continue <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </div>
  );
}
