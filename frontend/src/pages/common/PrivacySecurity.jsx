import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, Smartphone, Bell, CheckCircle, AlertCircle } from 'lucide-react';

const PrivacySecurity = ({ currentUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState(null);
  const [twoFa, setTwoFa] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    grievance: true,
    scholarship: true,
    forum: false,
    announcements: true,
  });

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPassMsg({ type: 'error', text: 'All fields are required' });
      return;
    }
    if (passwords.newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPassMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setPassMsg({ type: 'success', text: 'Password changed successfully!' });
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassMsg(null), 3000);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="border-b border-[var(--tertiary)] pb-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={16} style={{ color: 'var(--btn-bg)' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--paragraph)' }}>Security</span>
        </div>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>
          Privacy & Security
        </h2>
        <p className="text-sm mt-2 opacity-70" style={{ color: 'var(--paragraph)' }}>
          Manage your password, security preferences, and notification settings.
        </p>
      </div>

      {/* Change Password Section */}
      <div className="rounded border border-[var(--tertiary)] overflow-hidden shadow-sm mb-6">
        <div className="p-5 bg-[var(--secondary)] border-b border-[var(--tertiary)] flex items-center gap-3">
          <Lock size={18} style={{ color: 'var(--headline)' }} className="opacity-60" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>Change Password</h3>
            <p className="text-[10px] opacity-50 mt-0.5">Update your account password regularly for security</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {passMsg && (
            <div className={`p-3 rounded border flex items-center gap-2 text-sm font-bold ${
              passMsg.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {passMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {passMsg.text}
            </div>
          )}

          {['current', 'newPass', 'confirm'].map((key, i) => {
            const labels = ['Current Password', 'New Password', 'Confirm New Password'];
            return (
              <div key={key}>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2 block" style={{ color: 'var(--headline)' }}>
                  {labels[i]}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords[key]}
                    onChange={(e) => setPasswords(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent text-sm outline-none focus:border-[var(--headline)] transition-colors pr-12"
                    style={{ color: 'var(--headline)' }}
                    placeholder={`Enter ${labels[i].toLowerCase()}`}
                  />
                  {i === 1 && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleChangePassword}
            className="px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-colors"
            style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded border border-[var(--tertiary)] overflow-hidden shadow-sm mb-6">
        <div className="p-5 bg-[var(--secondary)] border-b border-[var(--tertiary)] flex items-center gap-3">
          <Smartphone size={18} style={{ color: 'var(--headline)' }} className="opacity-60" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>Two-Factor Authentication</h3>
            <p className="text-[10px] opacity-50 mt-0.5">Add an extra layer of security to your account</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--headline)' }}>
                {twoFa ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs opacity-50 mt-1">
                {twoFa ? 'Your account is protected with 2FA' : 'Enable 2FA for enhanced security'}
              </p>
            </div>
            <button
              onClick={() => setTwoFa(!twoFa)}
              className={`relative w-12 h-6 rounded-full transition-colors ${twoFa ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${twoFa ? 'translate-x-6' : 'translate-x-0.5'}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded border border-[var(--tertiary)] overflow-hidden shadow-sm mb-6">
        <div className="p-5 bg-[var(--secondary)] border-b border-[var(--tertiary)] flex items-center gap-3">
          <Bell size={18} style={{ color: 'var(--headline)' }} className="opacity-60" />
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-tight" style={{ color: 'var(--headline)' }}>Notification Preferences</h3>
            <p className="text-[10px] opacity-50 mt-0.5">Choose which notifications you want to receive</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--tertiary)]">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive important updates via email' },
            { key: 'grievance', label: 'Grievance Updates', desc: 'Get notified when your grievance status changes' },
            { key: 'scholarship', label: 'Scholarship Alerts', desc: 'Notifications about scholarship deadlines and status' },
            { key: 'forum', label: 'Forum Replies', desc: 'Get notified when someone replies to your queries' },
            { key: 'announcements', label: 'Announcements', desc: 'Receive portal-wide announcements' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--headline)' }}>{label}</p>
                <p className="text-xs opacity-50 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? 'translate-x-6' : 'translate-x-0.5'}`}></span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Session Info */}
      <div className="rounded border border-[var(--tertiary)] p-6 bg-[var(--secondary)]">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-4" style={{ color: 'var(--headline)' }}>
          Active Sessions
        </h4>
        <div className="p-4 rounded border border-[var(--tertiary)] bg-[var(--bg-color)] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Smartphone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--headline)' }}>Current Session</p>
              <p className="text-xs opacity-50 mt-0.5">Browser • {navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Browser'} • Active Now</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Active</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurity;
