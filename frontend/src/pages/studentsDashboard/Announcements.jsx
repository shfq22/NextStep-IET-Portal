import React, { useState } from 'react';
import { Megaphone, Calendar, ArrowRight, Filter, AlertCircle, FileText, ExternalLink } from 'lucide-react';

const Announcements = ({ data }) => {
  const [activeTab, setActiveTab] = useState('All');
  const filteredAnnouncements =
    activeTab === 'All'
      ? data.announcements
      : data.announcements.filter((item) => item.target === activeTab || item.target === 'All');

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-[var(--tertiary)] gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone size={16} style={{ color: 'var(--btn-bg)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Official Feed</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase" style={{ color: 'var(--headline)' }}>
            Announcements
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[var(--secondary)] p-1 rounded border border-[var(--tertiary)]">
          {['All', 'Branch', 'Year'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                activeTab === tab ? 'shadow-sm' : 'opacity-40 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: activeTab === tab ? 'var(--btn-bg)' : 'transparent',
                color: activeTab === tab ? 'var(--btn-text)' : 'var(--headline)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feed */}
      <div className="space-y-6">
        {filteredAnnouncements.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-[var(--bg-color)] border border-[var(--tertiary)] p-8 rounded hover:border-[var(--headline)] transition-all duration-300 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black px-2 py-0.5 border border-[var(--tertiary)] rounded uppercase tracking-tighter" style={{ color: 'var(--paragraph)' }}>
                    {item.id}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
                    {item.target}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--btn-bg)] transition-colors" style={{ color: 'var(--headline)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed opacity-70 max-w-3xl" style={{ color: 'var(--paragraph)' }}>
                    {item.body}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 opacity-50">
                    <Calendar size={14} />
                    <span className="text-[11px] font-bold uppercase">{item.date}</span>
                  </div>
                  <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b border-transparent hover:border-[var(--headline)] transition-all" style={{ color: 'var(--headline)' }}>
                    Read Full Circular <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Action Side-button */}
              <div className="flex md:flex-col gap-2">
                <div className="p-3 rounded border border-[var(--tertiary)]" title="Posted by admin">
                  <ExternalLink size={18} style={{ color: 'var(--headline)' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[var(--tertiary)] rounded mt-10">
          <AlertCircle size={40} className="mx-auto mb-4 opacity-20" />
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest">No announcements found in this category</p>
        </div>
      )}
    </div>
  );
};

export default Announcements;