import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

export default function AlumniOnboarding() {
  const navigate = useNavigate();
  const { alumniUser, saveAlumniPlacementProfile } = usePlacement();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [offerYear, setOfferYear] = useState(new Date().getFullYear());
  const [placementType, setPlacementType] = useState('on-campus');
  const [roundsRaw, setRoundsRaw] = useState('Phone screen — DSA\nOnsite — 2 coding rounds\nHR — culture fit');
  const [tips, setTips] = useState('');
  const [resourceLabel, setResourceLabel] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  useEffect(() => {
    if (!alumniUser) navigate('/placement/alumni');
  }, [alumniUser, navigate]);

  if (!alumniUser) return null;

  const submit = (e) => {
    e.preventDefault();
    const rounds = roundsRaw
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [name, ...rest] = line.split(/[—:-]/);
        return { name: name.trim(), detail: rest.join('—').trim() || '—' };
      });
    const resources = [];
    if (resourceLabel && resourceUrl) resources.push({ type: 'link', label: resourceLabel, url: resourceUrl });

    saveAlumniPlacementProfile({
      id: alumniUser.id,
      name: alumniUser.name,
      headline: alumniUser.headline,
      photoUrl: alumniUser.photoUrl,
      linkedInUrl: alumniUser.linkedInUrl,
      company,
      role,
      offerYear: Number(offerYear),
      placementType,
      rounds,
      tips,
      resources,
    });
    navigate('/placement/alumni/profile');
  };

  return (
    <PlacementShell showAlumniNav>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--headline)' }}>
          Fill placement details
        </h1>
        <p className="text-sm opacity-70 mb-8">Step 2 — your profile becomes discoverable after you publish.</p>
        <form onSubmit={submit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Company</label>
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Role</label>
              <input
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Offer year</label>
              <input
                type="number"
                required
                value={offerYear}
                onChange={(e) => setOfferYear(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Placement type</label>
              <select
                value={placementType}
                onChange={(e) => setPlacementType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              >
                <option value="on-campus">On-campus</option>
                <option value="off-campus">Off-campus</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50">Interview rounds (one per line, optional detail after —)</label>
            <textarea
              value={roundsRaw}
              onChange={(e) => setRoundsRaw(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm font-mono"
              style={{ color: 'var(--headline)' }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase opacity-50">Study tips &amp; what to prepare</label>
            <textarea
              required
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Resource label</label>
              <input
                value={resourceLabel}
                onChange={(e) => setResourceLabel(e.target.value)}
                placeholder="e.g. Company prep PDF"
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-50">Resource URL</label>
              <input
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://…"
                className="mt-1 w-full rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            Publish profile (Step 3)
          </button>
        </form>
      </div>
    </PlacementShell>
  );
}
