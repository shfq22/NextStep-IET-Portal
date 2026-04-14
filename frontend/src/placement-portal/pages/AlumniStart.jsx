import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function AlumniStart() {
  const { alumniUser } = usePlacement();

  if (alumniUser?.profileComplete) {
    return <Navigate to="/placement/alumni/profile" replace />;
  }
  if (alumniUser && !alumniUser.profileComplete) {
    return <Navigate to="/placement/alumni/onboarding" replace />;
  }

  return (
    <PlacementShell>
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--headline)' }}>
          Alumni onboarding
        </h1>
        <p className="text-sm opacity-70">Start with LinkedIn linking, then share your placement details.</p>
        <Link
          to="/placement/alumni/linkedin"
          className="inline-block px-8 py-3 rounded-xl font-bold text-sm"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          Begin step 1
        </Link>
      </div>
    </PlacementShell>
  );
}
