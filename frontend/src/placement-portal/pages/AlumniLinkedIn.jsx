import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Sparkles } from 'lucide-react';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function AlumniLinkedIn() {
  const navigate = useNavigate();
  const { registerAlumniFromLinkedIn } = usePlacement();
  const [loading, setLoading] = useState(false);

  const mockOAuth = () => {
    setLoading(true);
    setTimeout(() => {
      registerAlumniFromLinkedIn({
        name: 'You (LinkedIn Demo)',
        headline: 'Building backend systems · open to mentoring',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlumniDemo',
        linkedInUrl: 'https://www.linkedin.com/in/demo-alumni',
      });
      setLoading(false);
      navigate('/placement/alumni/onboarding');
    }, 900);
  };

  return (
    <PlacementShell showAlumniNav>
      <div className="max-w-lg mx-auto px-6 py-16">
        <div
          className="rounded-2xl border border-[var(--tertiary)] p-8 space-y-6"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}>
              <Link2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--headline)' }}>
                Register &amp; link LinkedIn
              </h1>
              <p className="text-xs opacity-60">Step 1 — OAuth demo pulls photo &amp; headline</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">
            In production this would be real LinkedIn OAuth. Here, one click simulates importing your **photo**, **headline**, and
            profile link.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={mockOAuth}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: '#0a66c2', color: '#fff' }}
          >
            <Sparkles size={18} />
            {loading ? 'Connecting…' : 'Continue with LinkedIn (demo)'}
          </button>
          <button type="button" onClick={() => navigate('/placement')} className="text-xs font-bold opacity-50 hover:opacity-100 w-full">
            Back
          </button>
        </div>
      </div>
    </PlacementShell>
  );
}
