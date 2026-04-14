import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  HelpCircle, 
  TrendingUp, 
  Plus,
  Minus,
  MessageCircle,
  ThumbsUp,
  Clock,
  Send,
} from 'lucide-react';
import { getForumPosts, voteForumPost, commentForumPost } from '../../api/api';

const Forum = ({ currentUser }) => {
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentOpenId, setCommentOpenId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const navigate = useNavigate();

  const userId = currentUser?.id || currentUser?.email || 'anonymous';
  const userName = currentUser?.name || 'Student';

  const mostAsked = [
    { q: "What is the last date for UP Scholarship 2026?", category: "Deadlines" },
    { q: "How to correct 'Suspicious Data' in the portal?", category: "Verification" },
    { q: "Is 75% attendance mandatory for NSP renewal?", category: "Compliance" },
  ];

  const fetchPosts = async () => {
    try {
      const res = await getForumPosts();
      setRecent(res.data.posts || []);
    } catch (err) {
      console.error('Failed to fetch forum posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const displayedRecent = useMemo(() => (showAllRecent ? recent : recent.slice(0, 6)), [showAllRecent, recent]);

  const toggleExpand = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const toggleComments = (postId) => {
    setCommentOpenId((prev) => (prev === postId ? null : postId));
    setCommentText('');
  };

  const handleVote = async (postId) => {
    try {
      const res = await voteForumPost(postId, userId);
      setRecent((prev) => prev.map((p) => (p.id === postId ? res.data.post : p)));
    } catch (err) {
      console.error('Failed to vote', err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      setSubmittingComment(true);
      const res = await commentForumPost(postId, { userName, text: commentText });
      setRecent((prev) => prev.map((p) => (p.id === postId ? res.data.post : p)));
      setCommentText('');
    } catch (err) {
      console.error('Failed to comment', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Primary Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 pb-6 border-b border-[var(--tertiary)] gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={16} style={{ color: 'var(--btn-bg)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Peer-to-Peer Help</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter uppercase" style={{ color: 'var(--headline)' }}>
            Community Forum
          </h2>
        </div>

        <button 
          onClick={() => navigate('/dsw/student/forum/ask')}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded font-black text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          <Plus size={16} /> Ask Your Doubt
        </button>
      </div>

      {/* Most Asked / Trending Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={16} className="text-blue-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--headline)' }}>Most Frequent Queries</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mostAsked.map((item, i) => (
            <div 
              key={i} 
              className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)] hover:border-[var(--headline)] transition-all cursor-pointer group"
            >
              <p className="text-[9px] font-bold uppercase opacity-40 mb-2 tracking-widest">{item.category}</p>
              <h4 className="text-[13px] font-bold leading-snug group-hover:underline decoration-[var(--btn-bg)]" style={{ color: 'var(--headline)' }}>
                {item.q}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: 'var(--headline)' }}>Recent Activity</h3>
          <div className="flex items-center gap-2 opacity-40 text-[10px] font-bold uppercase tracking-widest">
            <Clock size={12} /> Live Sync
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center opacity-50 text-sm">Loading forum posts...</div>
        ) : (
          <div className="border border-[var(--tertiary)] rounded divide-y divide-[var(--tertiary)] overflow-hidden shadow-sm">
            {displayedRecent.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const isCommentOpen = commentOpenId === post.id;
              const hasLiked = (post.likedBy || []).includes(userId);

              return (
                <div key={post.id} className="bg-[var(--bg-color)] transition-colors">
                  {/* Main Row */}
                  <div className="p-6 flex items-center justify-between gap-4">
                    {/* Left: user info + query */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold opacity-60" style={{ color: 'var(--headline)' }}>{post.user}</span>
                        <span className="h-1 w-1 rounded-full bg-[var(--tertiary)]"></span>
                        <span className="text-[10px] font-medium opacity-40" style={{ color: 'var(--paragraph)' }}>{post.time}</span>
                      </div>
                      <h4
                        className={`text-sm font-bold tracking-tight ${post.resolved ? 'opacity-70' : ''}`}
                        style={{ color: 'var(--headline)' }}
                      >
                        {post.query}
                      </h4>
                    </div>

                    {/* Right: like, comment, status, expand */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleVote(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                          hasLiked
                            ? 'bg-blue-50 border-blue-300 text-blue-600'
                            : 'border-transparent opacity-40 hover:opacity-80'
                        }`}
                        style={!hasLiked ? { color: 'var(--headline)' } : {}}
                        title={hasLiked ? 'Unlike' : 'Like'}
                      >
                        <ThumbsUp size={14} className={hasLiked ? 'fill-blue-500' : ''} />
                        <span>{post.votes}</span>
                      </button>

                      {/* Comment Toggle Button */}
                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border ${
                          isCommentOpen
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'border-transparent opacity-40 hover:opacity-80'
                        }`}
                        style={!isCommentOpen ? { color: 'var(--headline)' } : {}}
                        title="Comments"
                      >
                        <MessageCircle size={14} />
                        <span>{post.replies}</span>
                      </button>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                          post.resolved
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        }`}
                      >
                        {post.resolved ? 'Resolved' : 'Pending'}
                      </span>

                      {/* Accordion Toggle for resolved posts */}
                      {post.resolved && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(post.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--tertiary)] hover:bg-[var(--secondary)] transition-all"
                          style={{ color: 'var(--headline)' }}
                          title={isExpanded ? 'Collapse' : 'View admin reply'}
                        >
                          {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Admin Reply */}
                  {isExpanded && (
                    <div className="px-6 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-4 rounded-lg border border-green-200 bg-green-50/60">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">Admin Reply</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--paragraph)' }}>
                          {post.adminReply || 'Reply not available.'}
                        </p>
                        {post.resolvedAt && (
                          <p className="text-[10px] opacity-40 mt-3">Resolved on {post.resolvedAt}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Comments Section */}
                  {isCommentOpen && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="border border-[var(--tertiary)] rounded-lg overflow-hidden">
                        {/* Existing Comments */}
                        {(post.comments || []).length > 0 && (
                          <div className="divide-y divide-[var(--tertiary)] max-h-64 overflow-y-auto">
                            {(post.comments || []).map((c) => (
                              <div key={c.id} className="p-4 bg-[var(--secondary)]/30">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <span className="w-6 h-6 rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center text-[10px] font-bold">
                                    {c.user.charAt(0).toUpperCase()}
                                  </span>
                                  <span className="text-xs font-bold" style={{ color: 'var(--headline)' }}>{c.user}</span>
                                  <span className="text-[10px] opacity-40">{c.time}</span>
                                </div>
                                <p className="text-sm pl-8" style={{ color: 'var(--paragraph)' }}>{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {(post.comments || []).length === 0 && (
                          <div className="p-4 text-center text-xs opacity-40">No comments yet. Be the first to comment!</div>
                        )}

                        {/* Add Comment Input */}
                        <div className="p-3 bg-[var(--secondary)]/50 border-t border-[var(--tertiary)] flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[var(--btn-bg)] text-[var(--btn-text)] flex items-center justify-center text-[10px] font-bold shrink-0">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post.id); }}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 rounded-lg border border-[var(--tertiary)] bg-[var(--bg-color)] text-sm outline-none focus:ring-2 focus:ring-[var(--btn-bg)]"
                            style={{ color: 'var(--headline)' }}
                            disabled={submittingComment}
                          />
                          <button
                            type="button"
                            onClick={() => handleComment(post.id)}
                            disabled={submittingComment || !commentText.trim()}
                            className="w-9 h-9 flex items-center justify-center rounded-full transition-all disabled:opacity-30"
                            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                            title="Post comment"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show More Trigger */}
        {!showAllRecent && recent.length > 6 && (
          <button 
            onClick={() => setShowAllRecent(true)}
            className="w-full py-4 mt-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:bg-[var(--secondary)] border border-dashed border-[var(--tertiary)] rounded transition-all"
            style={{ color: 'var(--headline)' }}
          >
            Show More Recent Queries ↓
          </button>
        )}
      </div>

      {/* Guidelines Policy */}
      <div className="mt-12 p-6 rounded border border-[var(--tertiary)] bg-[var(--secondary)] flex gap-4 items-center">
        <HelpCircle size={20} className="text-blue-500 shrink-0" />
        <p className="text-[11px] leading-relaxed opacity-60" style={{ color: 'var(--paragraph)' }}>
          <strong>Forum Protocol:</strong> This is an official institutional resource. Please avoid sharing personal Roll Numbers or Aadhaar details in the public feed. For private document issues, please use the <strong>Document Vault</strong> AI-Support.
        </p>
      </div>
    </div>
  );
};

export default Forum;