import React from 'react';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentHome = ({ data }) => {
  const grievanceCount = data.grievances.length;
  const scholarshipCount = data.scholarshipApplications.length;
  const latestMessage = data.scholarshipApplications.find((app) => app.studentMessage)?.studentMessage;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase" style={{ color: 'var(--headline)' }}>Student Dashboard</h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Roll No: {data.currentUser?.rollNo} | Email: {data.currentUser?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">My Grievances</p>
          <p className="text-3xl font-black mt-1" style={{ color: 'var(--headline)' }}>{grievanceCount}</p>
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Scholarship Applications</p>
          <p className="text-3xl font-black mt-1" style={{ color: 'var(--headline)' }}>{scholarshipCount}</p>
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Documents Uploaded</p>
          <p className="text-3xl font-black mt-1" style={{ color: 'var(--headline)' }}>0</p>
        </div>
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-xs uppercase font-bold opacity-60">Announcements</p>
          <p className="text-3xl font-black mt-1" style={{ color: 'var(--headline)' }}>{data.announcements.length}</p>
        </div>
      </div>

      <div className="p-6 rounded border border-[var(--tertiary)] bg-[var(--bg-color)]">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2" style={{ color: 'var(--headline)' }}>Quick Flow</h3>
            <p className="text-sm opacity-70" style={{ color: 'var(--paragraph)' }}>
              Submit grievance, get ticket ID, and track status in My Grievances. Apply scholarship, upload checklist docs, and wait for volunteer/admin verification.
            </p>
          </div>
        </div>
      </div>

      {latestMessage && (
        <div className="p-5 rounded border border-green-500/30 bg-green-500/10 text-sm font-semibold text-green-600 flex gap-3 items-start">
          <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
          <span>{latestMessage}</span>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText size={20} style={{ color: 'var(--headline)' }} />
          <h3 className="font-bold text-lg" style={{ color: 'var(--headline)' }}>Recent Applications</h3>
        </div>
        <div className="space-y-3">
          {scholarshipCount === 0 ? (
            <div className="p-4 rounded border border-[var(--tertiary)] text-sm opacity-70">
              No active scholarship applications. <a href="/dsw/student/documents" className="font-bold underline">Apply now</a>
            </div>
          ) : (
            data.scholarshipApplications.slice(0, 3).map((app) => (
              <div key={app.id} className="p-4 rounded border border-[var(--tertiary)] bg-[var(--bg-color)]">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-bold" style={{ color: 'var(--headline)' }}>{app.scholarshipName}</p>
                    <p className="text-xs mt-1 opacity-70">Application ID: {app.id}</p>
                    <div className="mt-2">
                      <div className="flex gap-1 flex-wrap">
                        {app.docs.slice(0, 3).map((doc) => (
                          <span
                            key={doc.name}
                            className={`text-xs px-2 py-1 rounded font-bold ${
                              doc.status === 'Pending'
                                ? 'bg-blue-500/20 text-blue-700'
                                : doc.status === 'Verified'
                                ? 'bg-green-500/20 text-green-700'
                                : 'bg-orange-500/20 text-orange-700'
                            }`}
                          >
                            {doc.name}: {doc.status}
                          </span>
                        ))}
                        {app.docs.length > 3 && (
                          <span className="text-xs px-2 py-1 opacity-60">+{app.docs.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-2 rounded whitespace-nowrap ${
                      app.status === 'Under Review'
                        ? 'bg-blue-500/20 text-blue-700'
                        : app.status === 'Verified Complete'
                        ? 'bg-green-500/20 text-green-700'
                        : 'bg-gray-500/20 text-gray-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;