import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Moon,
  Sun,
  Landmark,
  ArrowLeft,
} from 'lucide-react';

export default function Login({ theme, toggleTheme, onLogin }) {
  const [activeTab, setActiveTab] = useState('Student');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const emailPlaceholder = activeTab === 'Student' ? 'you@ietlucknow.ac.in' : 'you@ietlucknow.edu';

  const handleSubmit = (e) => {
    e.preventDefault();
    const role =
      activeTab === 'Admin' ? 'admin' : activeTab === 'Teacher' ? 'teacher' : 'student';
    onLogin({
    role,
    rollNo: role === 'student' ? rollNo : '',
    email,
    password // ✅ ADD THIS
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-500"
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      <div
        className="hidden md:flex md:w-2/5 p-12 lg:p-16 flex-col justify-between border-r border-[var(--tertiary)]"
        style={{ backgroundColor: 'var(--secondary)' }}
      >
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-10 hover:opacity-70"
            style={{ color: 'var(--headline)' }}
          >
            <ArrowLeft size={14} /> College Connect
          </Link>
          <div className="flex items-center gap-2 mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Ietlogo.png" alt="IET Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tighter" style={{ color: 'var(--headline)' }}>
              IET LUCKNOW
            </span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4" style={{ color: 'var(--headline)' }}>
            Digital Student
            <br />
            Welfare Portal
          </h2>
          <p className="text-sm opacity-70 max-w-sm leading-relaxed" style={{ color: 'var(--paragraph)' }}>
            Scholarships, grievances, announcements, and forum — sign in with your institutional role.
          </p>

        </div>
        <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest" style={{ color: 'var(--paragraph)' }}>
          DSW module · College Connect
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center p-8 md:p-16">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-between items-center mb-8 md:hidden">
            <Link to="/" className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--headline)' }}>
              ← Home
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-[var(--tertiary)]"
              style={{ color: 'var(--headline)' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--headline)' }}>
            Sign in
          </h2>
          <p className="text-sm mb-8 opacity-70" style={{ color: 'var(--paragraph)' }}>
            Select your access level
          </p>

          <div className="flex border-b border-[var(--tertiary)] mb-8">
            {['Student', 'Admin', 'Teacher'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setRollNo('');
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${
                  activeTab === tab ? 'border-b-2' : 'opacity-50 hover:opacity-80'
                }`}
                style={{
                  color: 'var(--headline)',
                  borderColor: activeTab === tab ? 'var(--btn-bg)' : 'transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {activeTab === 'Student' && (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">Roll number</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 opacity-40" style={{ color: 'var(--headline)' }} />
                  <input
                    name="studentRollNo"
                    autoComplete="off"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--tertiary)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--btn-bg)] text-sm"
                    style={{ color: 'var(--headline)' }}
                    placeholder="210052010001"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 opacity-40" style={{ color: 'var(--headline)' }} />
                <input
                  type="email"
                  name="userEmail"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--tertiary)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--btn-bg)] text-sm"
                  style={{ color: 'var(--headline)' }}
                  placeholder={emailPlaceholder}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 opacity-40" style={{ color: 'var(--headline)' }} />
                <input
                  type="password"
                  name="userPassword"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--tertiary)] bg-transparent outline-none focus:ring-2 focus:ring-[var(--btn-bg)] text-sm"
                  style={{ color: 'var(--headline)' }}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg font-bold text-sm tracking-tight transition-transform hover:scale-[1.01] active:scale-[0.99]"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Verify &amp; enter
            </button>
          </form>

          <p className="mt-8 text-center text-sm opacity-60">
            New here?{' '}
            <Link to="/dsw/signup" className="font-bold underline-offset-2 hover:underline" style={{ color: 'var(--headline)' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
