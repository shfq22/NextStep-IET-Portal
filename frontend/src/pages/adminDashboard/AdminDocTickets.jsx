import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, User } from 'lucide-react';
import { getAllDocTickets, updateDocTicketDocStatus } from '../../api/api';

const AdminDocTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await getAllDocTickets();
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to fetch doc tickets', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleUpdateDocStatus = async (ticketId, docName, status, adminNote) => {
    try {
      await updateDocTicketDocStatus(ticketId, { docName, status, adminNote });
      await fetchTickets();
    } catch (err) {
      console.error('Failed to update doc status', err);
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

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-[var(--tertiary)] pb-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={16} style={{ color: 'var(--btn-bg)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Document Verification</span>
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>
          Document Tickets
        </h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Review student document uploads. Click a ticket to view and verify individual documents.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Tickets</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--headline)' }}>{tickets.length}</p>
        </div>
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Pending Review</p>
          <p className="text-2xl font-black mt-1 text-yellow-600">{tickets.filter(t => t.status === 'Pending Review').length}</p>
        </div>
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">All Verified</p>
          <p className="text-2xl font-black mt-1 text-green-600">{tickets.filter(t => t.status === 'All Verified').length}</p>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center opacity-50 text-sm">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="p-8 rounded border border-[var(--tertiary)] text-center">
          <FileText size={40} className="mx-auto opacity-20 mb-4" />
          <p className="text-sm opacity-60" style={{ color: 'var(--paragraph)' }}>No document tickets submitted yet.</p>
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
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                    <User size={18} style={{ color: 'var(--headline)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--headline)' }}>
                      {ticket.studentName} <span className="font-normal opacity-50">({ticket.studentRollNo})</span>
                    </p>
                    <p className="text-xs opacity-60 mt-0.5">{ticket.scholarshipName || 'Document Upload'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold opacity-40">{ticket.id}</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--tertiary)]"></span>
                      <span className="text-[10px] opacity-40">{ticket.createdAt}</span>
                      <span className="h-1 w-1 rounded-full bg-[var(--tertiary)]"></span>
                      <span className="text-[10px] font-bold opacity-40">{ticket.docs.length} docs</span>
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

              {/* Expanded Doc List with Actions */}
              {expandedId === ticket.id && (
                <div className="border-t border-[var(--tertiary)] p-5 bg-[var(--secondary)]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50" style={{ color: 'var(--headline)' }}>
                    Uploaded Documents
                  </p>
                  <div className="space-y-3">
                    {ticket.docs.map((doc, i) => (
                      <div key={i} className="p-4 rounded border border-[var(--tertiary)] bg-[var(--bg-color)]">
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-sm" style={{ color: 'var(--headline)' }}>{doc.name}</p>
                            {doc.fileName && <p className="text-xs opacity-60 mt-0.5">File: {doc.fileName}</p>}
                            {doc.fileSize > 0 && <p className="text-xs opacity-50 mt-0.5">Size: {(doc.fileSize / 1024).toFixed(1)} KB</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.status === 'Verified' ? <CheckCircle size={14} className="text-green-600" /> :
                             doc.status === 'Rejected' ? <AlertCircle size={14} className="text-red-600" /> :
                             <Clock size={14} className="text-yellow-600" />}
                            <span className={`text-xs font-bold uppercase ${docStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleUpdateDocStatus(ticket.id, doc.name, 'Verified', '')}
                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            ✓ Verify
                          </button>
                          <button
                            onClick={() => handleUpdateDocStatus(ticket.id, doc.name, 'Rejected', 'Document does not meet requirements.')}
                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                          >
                            ✗ Reject
                          </button>
                          <button
                            onClick={() => handleUpdateDocStatus(ticket.id, doc.name, 'Pending', '')}
                            className="px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            ↺ Reset
                          </button>
                        </div>

                        {doc.adminNote && (
                          <p className="text-xs mt-2 p-2 rounded bg-orange-50 text-orange-700 font-semibold">
                            Note: {doc.adminNote}
                          </p>
                        )}
                      </div>
                    ))}
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

export default AdminDocTickets;
