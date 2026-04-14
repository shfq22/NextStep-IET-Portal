import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Clock, ThumbsUp, MessageCircle } from 'lucide-react';
import { getForumPosts } from '../../api/api';

const AdminForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unresolved, resolved
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await getForumPosts();
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch forum posts', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const filtered = posts.filter(p => {
    if (filter === 'unresolved') return !p.resolved;
    if (filter === 'resolved') return p.resolved;
    return true;
  });

  const unresolvedCount = posts.filter(p => !p.resolved).length;
  const resolvedCount = posts.filter(p => p.resolved).length;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="border-b border-[var(--tertiary)] pb-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={16} style={{ color: 'var(--btn-bg)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Forum Management</span>
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>
          Student Doubts
        </h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Review and resolve student forum queries. Mark doubts as resolved to notify students.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Total Queries</p>
          <p className="text-2xl font-black mt-1" style={{ color: 'var(--headline)' }}>{posts.length}</p>
        </div>
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Unresolved</p>
          <p className="text-2xl font-black mt-1 text-yellow-600">{unresolvedCount}</p>
        </div>
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--secondary)]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Resolved</p>
          <p className="text-2xl font-black mt-1 text-green-600">{resolvedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'unresolved', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border transition-colors ${
              filter === f
                ? 'border-[var(--headline)] bg-[var(--headline)] text-[var(--bg-color)]'
                : 'border-[var(--tertiary)] hover:border-[var(--headline)]'
            }`}
            style={filter !== f ? { color: 'var(--headline)' } : {}}
          >
            {f} ({f === 'all' ? posts.length : f === 'unresolved' ? unresolvedCount : resolvedCount})
          </button>
        ))}
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="p-6 text-center opacity-50 text-sm">Loading forum posts...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 rounded border border-[var(--tertiary)] text-center">
          <MessageSquare size={40} className="mx-auto opacity-20 mb-4" />
          <p className="text-sm opacity-60">No queries found.</p>
        </div>
      ) : (
        <div className="border border-[var(--tertiary)] rounded divide-y divide-[var(--tertiary)] overflow-hidden shadow-sm">
          {filtered.map((post) => (
            <div key={post.id} className="p-5 bg-[var(--bg-color)] hover:bg-[var(--secondary)]/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold opacity-60" style={{ color: 'var(--headline)' }}>{post.user}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--tertiary)]"></span>
                    <span className="text-[10px] opacity-40">{post.time}</span>
                    {post.category && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-[var(--tertiary)]"></span>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--secondary)] opacity-60">{post.category}</span>
                      </>
                    )}
                  </div>
                  <h4
                    className={`text-sm font-bold tracking-tight ${post.resolved ? 'line-through opacity-50' : ''}`}
                    style={{ color: 'var(--headline)' }}
                  >
                    {post.query}
                  </h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 opacity-40">
                      <ThumbsUp size={12} />
                      <span className="text-[10px] font-bold">{post.votes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <MessageCircle size={12} />
                      <span className="text-[10px] font-bold">{post.replies}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {post.resolved ? (
                    <span className="flex items-center gap-1.5 text-green-600">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Resolved</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-yellow-600">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/dsw/admin/forum/${post.id}`)}
                    className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                      post.resolved
                        ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-[var(--tertiary)] hover:bg-[var(--secondary)]'
                    }`}
                    style={post.resolved ? {} : { color: 'var(--headline)' }}
                  >
                    {post.resolved ? 'View Reply' : 'Resolve Query'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminForum;
