import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { postForumDoubt } from '../../../api/api';

const AskDoubt = ({ userName }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Scholarship',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postForumDoubt({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        userName: userName || 'Student',
      });
      alert('Doubt posted successfully to the IET Forum.');
      navigate('/dsw/student/forum');
    } catch (err) {
      console.error('Failed to post doubt', err);
      alert('Failed to post doubt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/dsw/student/forum')}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 opacity-50 hover:opacity-100 transition-all"
        style={{ color: 'var(--headline)' }}
      >
        <ArrowLeft size={14} /> Back to Forum
      </button>

      <div className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tighter uppercase mb-2" style={{ color: 'var(--headline)' }}>
          Ask a Doubt
        </h2>
        <p className="text-sm opacity-60" style={{ color: 'var(--paragraph)' }}>
          Your query will be visible to the IET community and verified volunteers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--headline)' }}>
            Query Category
          </label>
          <div className="flex flex-wrap gap-3">
            {['Scholarship', 'Academic', 'Verification', 'Technical'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({...formData, category: cat})}
                className={`px-5 py-2 rounded text-[11px] font-bold border transition-all ${
                  formData.category === cat 
                  ? 'border-[var(--headline)] shadow-sm' 
                  : 'border-[var(--tertiary)] opacity-40'
                }`}
                style={{ 
                  backgroundColor: formData.category === cat ? 'var(--btn-bg)' : 'transparent',
                  color: 'var(--headline)' 
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--headline)' }}>
            Subject Heading
          </label>
          <input 
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-5 py-4 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm font-medium"
            style={{ color: 'var(--headline)' }}
            placeholder="e.g. Issue with Income Certificate date verification..."
          />
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: 'var(--headline)' }}>
            Detailed Description
          </label>
          <textarea 
            rows="6"
            required
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-5 py-4 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm font-medium leading-relaxed"
            style={{ color: 'var(--headline)' }}
            placeholder="Explain your doubt in detail. Mention any error codes if applicable..."
          ></textarea>
        </div>

        {/* Security / Policy Notice */}
        <div className="p-5 rounded border border-[var(--tertiary)] bg-[var(--secondary)] flex gap-4 items-start">
          <ShieldCheck size={20} className="text-blue-500 shrink-0" />
          <p className="text-[11px] leading-relaxed opacity-60" style={{ color: 'var(--paragraph)' }}>
            <strong>Privacy Reminder:</strong> Do not post sensitive data like high-resolution photos of Aadhar or Passwords. Our AI-Moderator will automatically flag posts containing private identifiers.
          </p>
        </div>

        {/* Action Button */}
        <button 
          type="submit"
          disabled={submitting}
          className="w-full py-5 rounded font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:brightness-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
        >
          {submitting ? 'Posting...' : 'Publish Query'} <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AskDoubt;