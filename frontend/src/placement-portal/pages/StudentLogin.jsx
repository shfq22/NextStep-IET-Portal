import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent, studentUser } = usePlacement();
  const [name, setName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('student@iet.ac.in');

  if (studentUser) {
    return <Navigate to="/placement/student/discover" replace />;
  }

  const submit = (e) => {
    e.preventDefault();
    loginStudent(name, email);
    navigate('/placement/student/discover');
  };

  return (
    <PlacementShell>
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--headline)' }}>
          Student login
        </h1>
        <p className="text-sm opacity-70 mb-8">Lightweight gate — demo only (no real auth).</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            Continue to discovery
          </button>
        </form>
      </div>
    </PlacementShell>
  );
}
