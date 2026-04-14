import React, { useState } from 'react';

const AdminScholarships = ({ data }) => {
  const toggleDoc = (appId, doc) => {
    const next = doc.status === 'Verified' ? 'Pending' : 'Verified';
    data.updateScholarshipDoc(appId, doc.name, next);
  };

  const [newDocs, setNewDocs] = useState({});
  const [correctionNotes, setCorrectionNotes] = useState({});

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[var(--tertiary)] pb-5">
        <h2 className="text-3xl font-extrabold uppercase">Scholarship Applications</h2>
        <p className="text-sm mt-2 opacity-70">
          View docs in preview form, mark each document as verified or reupload, then click Verify Complete.
        </p>
      </div>

      {data.scholarshipApplications.length === 0 && (
        <div className="p-4 rounded border border-[var(--tertiary)]">No scholarship applications submitted yet.</div>
      )}

      {data.scholarshipApplications.map((app) => {
        const allVerified = app.docs.every((doc) => doc.status === 'Verified');
        const newDoc = newDocs[app.id] || '';
        return (
          <div key={app.id} className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)] space-y-3">
            <p className="font-bold">{app.scholarshipName}</p>
            <p className="text-xs opacity-70">Student Roll No: {app.studentRollNo} | Current status: {app.status}</p>

            <div className="p-3 rounded border border-[var(--tertiary)] bg-[var(--bg-color)] space-y-2">
              <p className="text-xs font-bold uppercase opacity-70">Add more required documents</p>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  value={newDoc}
                  onChange={(e) => setNewDocs((prev) => ({ ...prev, [app.id]: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
                  placeholder="e.g. Admission Receipt"
                />
                <button
                  onClick={() => {
                    data.addScholarshipRequiredDoc(app.id, newDoc);
                    setNewDocs((prev) => ({ ...prev, [app.id]: '' }));
                  }}
                  className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  type="button"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {app.docs.map((doc) => (
                <div key={doc.name} className="p-3 rounded border border-[var(--tertiary)] bg-[var(--bg-color)] flex flex-col md:flex-row md:justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{doc.name}</p>
                    <p className="text-xs opacity-70">Preview: {doc.fileName || 'No file uploaded'}</p>
                    {doc.status === 'Reupload Requested' && doc.note && (
                      <p className="text-xs mt-1 text-red-600 font-semibold">Note to student: {doc.note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{doc.status}</span>
                    <button onClick={() => toggleDoc(app.id, doc)} className="px-3 py-1 rounded border border-[var(--tertiary)] text-xs">
                      {doc.status === 'Verified' ? 'Unverify' : 'Mark ✅'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded border border-[var(--tertiary)] bg-[var(--bg-color)] space-y-2">
              <p className="text-xs font-bold uppercase opacity-70">Request correction / reupload (with note)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  className="px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
                  value={correctionNotes[app.id]?.docName || (app.docs[0]?.name ?? '')}
                  onChange={(e) =>
                    setCorrectionNotes((prev) => ({
                      ...prev,
                      [app.id]: { ...(prev[app.id] || {}), docName: e.target.value },
                    }))
                  }
                >
                  {app.docs.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <input
                  className="px-3 py-2 rounded border border-[var(--tertiary)] bg-transparent"
                  placeholder="Note (what is wrong + what to upload)"
                  value={correctionNotes[app.id]?.note || ''}
                  onChange={(e) =>
                    setCorrectionNotes((prev) => ({
                      ...prev,
                      [app.id]: { ...(prev[app.id] || {}), note: e.target.value },
                    }))
                  }
                />
              </div>
              <button
                type="button"
                className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                onClick={() => {
                  const docName = correctionNotes[app.id]?.docName || app.docs[0]?.name;
                  const note = correctionNotes[app.id]?.note || '';
                  if (!docName) return;
                  data.requestScholarshipDocCorrection(app.id, docName, note);
                }}
              >
                Send correction request
              </button>
            </div>

            <button
              disabled={!allVerified}
              onClick={() => data.markScholarshipVerified(app.id)}
              className="px-4 py-2 rounded text-xs font-bold uppercase tracking-widest disabled:opacity-40"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Verify Complete
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AdminScholarships;
