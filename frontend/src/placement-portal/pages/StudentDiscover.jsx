import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Building2, Filter, Search, Sparkles } from 'lucide-react';
import PlacementShell from '../components/PlacementShell';
import { usePlacement } from '../PlacementContext';

function SeniorCard({ s }) {
  return (
    <Link
      to={`/placement/student/profile/${s.id}`}
      className="group rounded-2xl border border-[var(--tertiary)] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 text-left block"
      style={{ backgroundColor: 'var(--secondary)' }}
    >
      <div className="flex gap-4 p-4">
        <img src={s.photoUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[var(--tertiary)]" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm truncate" style={{ color: 'var(--headline)' }}>
            {s.name}
          </p>
          <p className="text-xs opacity-60 truncate">{s.headline}</p>
          <p className="text-xs font-bold mt-2" style={{ color: 'var(--headline)' }}>
            {s.company} · {s.role}
          </p>
          <p className="text-[10px] uppercase tracking-wider opacity-50 mt-0.5">
            {s.offerYear} · {s.placementType}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function StudentDiscover() {
  const { seniors, studentUser, studentNotifications, markNotificationsRead } = usePlacement();
  const [q, setQ] = useState('');
  const [company, setCompany] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [year, setYear] = useState('');
  const [placementType, setPlacementType] = useState('');

  const companies = useMemo(() => [...new Set(seniors.map((s) => s.company))].sort(), [seniors]);
  const years = useMemo(() => [...new Set(seniors.map((s) => s.offerYear))].sort((a, b) => b - a), [seniors]);

  const filtered = useMemo(() => {
    let list = [...seniors];
    list.sort((a, b) => b.offerYear - a.offerYear || a.name.localeCompare(b.name));
    const qq = q.toLowerCase();
    if (qq) {
      list = list.filter(
        (s) =>
          s.company.toLowerCase().includes(qq) ||
          s.role.toLowerCase().includes(qq) ||
          s.name.toLowerCase().includes(qq) ||
          String(s.offerYear).includes(qq),
      );
    }
    if (company) list = list.filter((s) => s.company === company);
    if (roleFilter) list = list.filter((s) => s.role.toLowerCase().includes(roleFilter.toLowerCase()));
    if (year) list = list.filter((s) => String(s.offerYear) === year);
    if (placementType) list = list.filter((s) => s.placementType === placementType);
    return list;
  }, [seniors, q, company, roleFilter, year, placementType]);

  if (!studentUser) {
    return <Navigate to="/placement/student" replace />;
  }

  const unread = studentNotifications.filter((n) => !n.read);

  return (
    <PlacementShell showStudentNav>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--headline)' }}>
              Discover seniors
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Default feed shows everyone — most recent placement year first. Use search or filters to narrow down.
            </p>
          </div>
          <Link
            to="/placement/student/chat"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[var(--tertiary)]"
            style={{ color: 'var(--headline)' }}
          >
            <Sparkles size={16} />
            AI doubt resolver
          </Link>
        </div>

        {unread.length > 0 && (
          <button
            type="button"
            onClick={markNotificationsRead}
            className="mb-6 w-full sm:w-auto text-left px-4 py-3 rounded-xl text-sm border border-[var(--tertiary)]"
            style={{ backgroundColor: 'var(--secondary)', color: 'var(--headline)' }}
          >
            <strong>{unread.length} referral update(s)</strong> — tap to mark read:{' '}
            {unread.map((n) => n.text).join(' · ')}
          </button>
        )}

        <div
          className="rounded-2xl border border-[var(--tertiary)] p-4 mb-8 space-y-4"
          style={{ backgroundColor: 'var(--secondary)' }}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50">
            <Filter size={14} />
            Search &amp; filters
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="relative md:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Company, role, name, year…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--tertiary)] bg-transparent text-sm"
                style={{ color: 'var(--headline)' }}
              />
            </div>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            >
              <option value="">All companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="Role contains…"
              className="rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            >
              <option value="">All batches (year)</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
            <select
              value={placementType}
              onChange={(e) => setPlacementType(e.target.value)}
              className="rounded-lg border border-[var(--tertiary)] bg-transparent px-3 py-2 text-sm"
              style={{ color: 'var(--headline)' }}
            >
              <option value="">Placement type</option>
              <option value="on-campus">On-campus</option>
              <option value="off-campus">Off-campus</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-60 mb-4">
          <Building2 size={16} />
          Showing <strong>{filtered.length}</strong> profile{filtered.length !== 1 ? 's' : ''}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <SeniorCard key={s.id} s={s} />
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center py-16 opacity-50">No profiles match — clear filters to see everyone.</p>}
      </div>
    </PlacementShell>
  );
}
