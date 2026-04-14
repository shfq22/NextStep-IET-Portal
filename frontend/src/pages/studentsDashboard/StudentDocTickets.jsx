import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Upload, XCircle } from 'lucide-react';
import { getStudentDocTickets, reuploadDocTicketDoc } from '../../api/api';

const StudentDocTickets = ({ currentUser }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [uploading, setUploading] = useState(null); // "ticketId-docName" while uploading
  const fileInputRefs = useRef({});

  const fetchTickets = useCallback(async () => {
    try {
      if (!currentUser?.rollNo) { setLoading(false); return; }
      const res = await getStudentDocTickets(currentUser.rollNo);
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch doc tickets', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleReupload = async (ticketId, docName, file) => {
    if (!file) return;
    const key = `${ticketId}-${docName}`;
    setUploading(key);
    try {
      await reuploadDocTicketDoc(ticketId, {
        docName,
        fileName: file.name,
        fileSize: file.size,
      });
      await fetchTickets();
    } catch (err) {
      console.error('Reupload failed', err);
      alert('Reupload failed');
    } finally {
      setUploading(null);
    }
  };

  const statusColor = (status) => {
    if (status === 'All Verified') return 'bg-green-100 text-green-700';
    if (status === 'Action Required') return 'bg-red-100 text-red-700';
    if (status === 'Docs Missing') return 'bg-gray-100 text-gray-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  const docStatusColor = (status) => {
    if (status === 'Verified') return 'text-green-600';
    if (status === 'Rejected') return 'text-red-600';
    if (status === 'Missing') return 'text-gray-400';
    return 'text-yellow-600';
  };

  const docStatusIcon = (status) => {
    if (status === 'Verified') return <CheckCircle size={14} className="text-green-600" />;
    if (status === 'Rejected') return <AlertCircle size={14} className="text-red-600" />;
    if (status === 'Missing') return <XCircle size={14} className="text-gray-400" />;
    return <Clock size={14} className="text-yellow-600" />;
  };

  const needsReupload = (status) => status === 'Rejected' || status === 'Missing';

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-[var(--tertiary)] pb-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} style={{ color: 'var(--btn-bg)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Document Tracking</span>
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>
          My Upload Tickets
        </h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Track the verification status of your uploaded documents. Reupload rejected or missing documents.
        </p>
      </div>

      {loading ? (
        <div className="p-6 text-center opacity-50 text-sm">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="p-8 rounded border border-[var(--tertiary)] text-center">
          <FileText size={40} className="mx-auto opacity-20 mb-4" />
          <p className="text-sm opacity-60" style={{ color: 'var(--paragraph)' }}>No document tickets yet. Upload documents via Scholarships page to generate a ticket.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded border border-[var(--tertiary)] overflow-hidden bg-[var(--bg-color)] shadow-sm">
              {/* Ticket Header */}
              <button
                onClick={() => setExpandedId(expandedId === ticket.id ? null : ticket.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-[var(--secondary)] transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-50" style={{ color: 'var(--paragraph)' }}>
                      {ticket.id}
                    </p>
                    <p className="font-bold text-sm mt-1" style={{ color: 'var(--headline)' }}>
                      {ticket.scholarshipName || 'Document Upload'}
                    </p>
                    <div className="flex items-center gap-2 mt-1 opacity-50">
                      <Clock size={12} />
                      <span className="text-xs">{ticket.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  {expandedId === ticket.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded Doc List */}
              {expandedId === ticket.id && (
                <div className="border-t border-[var(--tertiary)] p-5 bg-[var(--secondary)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50" style={{ color: 'var(--headline)' }}>
                    Documents ({ticket.docs.length})
                  </p>
                  <div className="space-y-3">
                    {ticket.docs.map((doc, i) => {
                      const uploadKey = `${ticket.id}-${doc.name}`;
                      const isUploading = uploading === uploadKey;

                      return (
                        <div key={i} className="p-4 rounded border border-[var(--tertiary)] bg-[var(--bg-color)]">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-bold text-sm" style={{ color: 'var(--headline)' }}>{doc.name}</p>
                              {doc.fileName && <p className="text-xs opacity-60 mt-1">File: {doc.fileName}</p>}
                              {doc.adminNote && (
                                <p className="text-xs mt-1 text-orange-600 font-semibold">
                                  Admin: {doc.adminNote}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {docStatusIcon(doc.status)}
                              <span className={`text-xs font-bold uppercase ${docStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </div>
                          </div>

                          {/* Reupload section for rejected/missing docs */}
                          {needsReupload(doc.status) && (
                            <div className="mt-3 pt-3 border-t border-[var(--tertiary)]">
                              <div className="flex items-center gap-3">
                                <input
                                  ref={(el) => { if (el) fileInputRefs.current[uploadKey] = el; }}
                                  type="file"
                                  accept=".pdf,image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleReupload(ticket.id, doc.name, file);
                                  }}
                                />
                                <button
                                  onClick={() => fileInputRefs.current[uploadKey]?.click()}
                                  disabled={isUploading}
                                  className="flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest border border-[var(--btn-bg)] hover:bg-[var(--btn-bg)] hover:text-[var(--btn-text)] transition-colors disabled:opacity-50"
                                  style={{ color: 'var(--btn-bg)' }}
                                >
                                  <Upload size={14} />
                                  {isUploading ? 'Uploading...' : doc.status === 'Missing' ? 'Upload Document' : 'Reupload Document'}
                                </button>
                                <span className="text-[10px] opacity-50">
                                  {doc.status === 'Rejected' ? 'This document was rejected. Please upload a corrected version.' : 'This document is missing. Please upload it.'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDocTickets;
