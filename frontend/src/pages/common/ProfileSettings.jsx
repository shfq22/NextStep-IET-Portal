import React, { useState } from 'react';
import { User, Mail, GraduationCap, Hash, Building, Save, X, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = ({ currentUser, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    rollNo: currentUser?.rollNo || '',
    course: currentUser?.course || '',
    year: currentUser?.year || '',
    department: currentUser?.department || '',
    phone: currentUser?.phone || '',
  });

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ ...form });
    }
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      rollNo: currentUser?.rollNo || '',
      course: currentUser?.course || '',
      year: currentUser?.year || '',
      department: currentUser?.department || '',
      phone: currentUser?.phone || '',
    });
    setIsEditing(false);
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: <User size={16} />, editable: true },
    { key: 'email', label: 'Email Address', icon: <Mail size={16} />, editable: false },
    { key: 'rollNo', label: 'Roll Number', icon: <Hash size={16} />, editable: false },
    { key: 'course', label: 'Course', icon: <GraduationCap size={16} />, editable: true, placeholder: 'e.g. B.Tech CSE' },
    { key: 'year', label: 'Year', icon: <Hash size={16} />, editable: true, placeholder: 'e.g. 3rd Year' },
    { key: 'department', label: 'Department', icon: <Building size={16} />, editable: true },
    { key: 'phone', label: 'Phone Number', icon: <User size={16} />, editable: true, placeholder: 'Add phone number' },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className="rounded-3xl p-[1px] shadow-xl"
        style={{ background: 'linear-gradient(120deg, #b9d5ff, #f8f3d7)' }}
      >
        <section className="rounded-3xl border border-[var(--tertiary)] overflow-hidden" style={{ backgroundColor: 'var(--bg-color)' }}>
          <div className="h-14 border-b border-[var(--tertiary)] px-6 flex items-center justify-between" style={{ backgroundColor: 'var(--secondary)' }}>
            <div className="flex items-center gap-2 text-xs font-semibold opacity-70" style={{ color: 'var(--paragraph)' }}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[var(--tertiary)] hover:bg-[var(--bg-color)]"
                style={{ color: 'var(--headline)' }}
                type="button"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <User size={14} />
              <span>Profile Settings</span>
            </div>
          </div>

          {saved && (
            <div className="mx-6 mt-5 p-3 rounded-lg border border-green-200 bg-green-50 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <p className="text-xs font-semibold text-green-700">Profile updated successfully.</p>
            </div>
          )}

          <div className="m-6 rounded-2xl border border-[var(--tertiary)] overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--tertiary)] flex items-center justify-between" style={{ backgroundColor: 'var(--secondary)' }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black shadow-sm" style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}>
                  {(currentUser?.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--headline)' }}>{currentUser?.name || 'User'}</h3>
                  <p className="text-xs opacity-65" style={{ color: 'var(--paragraph)' }}>{currentUser?.email}</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-[var(--tertiary)]"
                    style={{ color: 'var(--headline)' }}
                  >
                    <X size={12} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                  >
                    <Save size={12} /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(({ key, label, icon, editable, placeholder, multiline }) => (
                  <div key={key} className={multiline ? 'md:col-span-2' : ''}>
                    <label className="text-[11px] font-semibold mb-1.5 flex items-center gap-2 opacity-75" style={{ color: 'var(--paragraph)' }}>
                      <span className="opacity-60">{icon}</span> {label}
                    </label>
                    {isEditing && editable ? (
                      multiline ? (
                        <textarea
                          value={form[key]}
                          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--tertiary)] bg-transparent text-sm outline-none focus:border-[var(--headline)] resize-none"
                          style={{ color: 'var(--headline)' }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={form[key]}
                          onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 rounded-lg border border-[var(--tertiary)] bg-transparent text-sm outline-none focus:border-[var(--headline)]"
                          style={{ color: 'var(--headline)' }}
                        />
                      )
                    ) : (
                      <div className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-[var(--tertiary)] text-sm flex items-center" style={{ color: form[key] ? 'var(--headline)' : 'var(--paragraph)' }}>
                        {form[key] || <span className="opacity-50">{placeholder || 'Not set'}</span>}
                      </div>
                    )}
                    {!editable && isEditing && (
                      <p className="text-[10px] opacity-45 mt-1">This field cannot be modified.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-6 mb-6 rounded-2xl border border-[var(--tertiary)] p-5" style={{ backgroundColor: 'var(--secondary)' }}>
            <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-3" style={{ color: 'var(--paragraph)' }}>
              Account Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <p><span className="opacity-60">Role:</span> <span style={{ color: 'var(--headline)' }}>{currentUser?.role || 'student'}</span></p>
              <p><span className="opacity-60">Member Since:</span> <span style={{ color: 'var(--headline)' }}>{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span></p>
              <p><span className="opacity-60">Status:</span> <span className="text-green-600 font-semibold">Verified</span></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
