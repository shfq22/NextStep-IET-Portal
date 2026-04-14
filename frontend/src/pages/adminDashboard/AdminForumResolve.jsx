import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Pencil } from 'lucide-react';
import { getForumPosts, toggleForumResolved } from '../../api/api';

const AdminForumResolve = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getForumPosts();
        const found = (res.data.posts || []).find((p) => String(p.id) === String(id));
        setPost(found || null);
        setReplyText(found?.adminReply || '');
      } catch (err) {
        console.error('Failed to load forum post', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleResolve = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) {
      alert('Please add a reply before resolving');
      return;
    }
    try {
      setSaving(true);
      const res = await toggleForumResolved(post.id, { resolved: true, adminReply: trimmed });
      setPost(res.data.post);
      setEditing(false);
    } catch (err) {
      console.error('Failed to resolve query', err);
      alert(err?.response?.data?.message || 'Failed to resolve query');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    const trimmed = replyText.trim();
    if (!trimmed) {
      alert('Reply cannot be empty');
      return;
    }
    try {
      setSaving(true);
      const res = await toggleForumResolved(post.id, { resolved: true, adminReply: trimmed });
      setPost(res.data.post);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update reply', err);
      alert(err?.response?.data?.message || 'Failed to update reply');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setReplyText(post.adminReply || '');
    setEditing(false);
  };

  if (loading) {
    return <div className="p-6 text-sm opacity-60">Loading query...</div>;
  }

  if (!post) {
    return (
      <div className="p-6 rounded-xl border border-[var(--tertiary)]">
        <p className="text-sm opacity-70 mb-3">Query not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dsw/admin/forum')}
          className="px-4 py-2 rounded-lg border border-[var(--tertiary)] text-xs font-semibold"
          style={{ color: 'var(--headline)' }}
        >
          Back to Forum
        </button>
      </div>
    );
  }

  const isTextareaDisabled = post.resolved && !editing;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dsw/admin/forum')}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--tertiary)] text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--headline)' }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        {post.resolved ? (
          <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-bold uppercase tracking-widest">
            <CheckCircle size={14} />
            Resolved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-yellow-600 text-xs font-bold uppercase tracking-widest">
            <Clock size={14} />
            Pending
          </span>
        )}
      </div>

      <div className="p-6 rounded-2xl border border-[var(--tertiary)] bg-[var(--bg-color)] shadow-sm">
        <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{post.category || 'General'}</p>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--headline)' }}>{post.query}</h2>
        {post.description && (
          <p className="text-sm opacity-80 mb-4" style={{ color: 'var(--paragraph)' }}>
            {post.description}
          </p>
        )}

        <label className="text-[11px] font-bold uppercase tracking-widest opacity-60 block mb-2">
          Admin Reply
        </label>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={5}
          disabled={isTextareaDisabled}
          placeholder="Type your response for the student..."
          className={`w-full p-3 rounded-lg border bg-transparent text-sm outline-none transition-all ${
            editing
              ? 'border-blue-400 ring-2 ring-blue-100'
              : 'border-[var(--tertiary)] focus:border-[var(--headline)]'
          } ${isTextareaDisabled ? 'opacity-70' : ''}`}
          style={{ color: 'var(--headline)' }}
        />

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {/* Not resolved yet — show Resolve button */}
          {!post.resolved && (
            <button
              type="button"
              onClick={handleResolve}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              {saving ? 'Saving...' : 'Resolve Query'}
            </button>
          )}

          {/* Resolved & NOT editing — show success message + Edit button */}
          {post.resolved && !editing && (
            <>
              <p className="text-xs text-green-600 font-semibold">Reply sent and query marked resolved.</p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--tertiary)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--secondary)] transition-all"
                style={{ color: 'var(--headline)' }}
              >
                <Pencil size={12} />
                Edit Reply
              </button>
            </>
          )}

          {/* Resolved & editing — show Save / Cancel */}
          {post.resolved && editing && (
            <>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
                style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border border-[var(--tertiary)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--secondary)] transition-all"
                style={{ color: 'var(--headline)' }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminForumResolve;
