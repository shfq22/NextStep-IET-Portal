import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onSignUp) return;
    await onSignUp({ name, email, password, role, rollNo, department });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row transition-colors duration-500" style={{ backgroundColor: 'var(--bg-color)' }}>
      
      {/* Left Panel: Institutional Branding */}
      <div className="hidden md:flex md:w-2/5 p-16 flex-col justify-between border-r border-[var(--tertiary)]" style={{ backgroundColor: 'var(--secondary)' }}>
        <div>
          <button
            onClick={() => navigate('/dsw/login')}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-10 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--headline)' }}
          >
            <ArrowLeft size={14} /> College Connect
          </button>
          
          <div className="flex items-center gap-2 mb-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/47/Ietlogo.png" alt="IET Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tighter" style={{ color: 'var(--headline)' }}>
              IET LUCKNOW
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold leading-tight mb-4" style={{ color: 'var(--headline)' }}>
            Digital Student
            <br />
            Welfare Portal
          </h1>

          <p className="text-sm opacity-70 max-w-sm leading-relaxed" style={{ color: 'var(--paragraph)' }}>
            Scholarships, grievances, announcements, and forum — sign in with your institutional role.
          </p>
        </div>

        <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest" style={{ color: 'var(--paragraph)' }}>
          DSW module · College Connect
        </p>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--headline)' }}>Create Profile</h2>
            <p className="text-sm opacity-70" style={{ color: 'var(--paragraph)' }}>Please provide your official academic credentials.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Legal Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} style={{ color: 'var(--headline)' }} />
                <input 
                  type="text" 
                  name="fullName"
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm"
                  style={{ color: 'var(--headline)' }}
                  placeholder="e.g. Unnati Singh"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University ID */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Roll Number</label>
                <input 
                  type="text" 
                  name="studentRollNo"
                  autoComplete="off"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm uppercase"
                  style={{ color: 'var(--headline)' }}
                  placeholder="210052..."
                  required
                />
              </div>

              {/* Branch Selector - Pro look */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Department</label>
                <select 
                  name="department"
                  autoComplete="off"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm appearance-none"
                  style={{ color: 'var(--headline)', backgroundColor: 'var(--bg-color)' }}
                >
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="ME">ME</option>
                </select>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} style={{ color: 'var(--headline)' }} />
                <input 
                  type="email" 
                  name="signupEmail"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm"
                  style={{ color: 'var(--headline)' }}
                  placeholder="student@ietlucknow.ac.in"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Security Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} style={{ color: 'var(--headline)' }} />
                <input 
                  type="password" 
                  name="signupPassword"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm"
                  style={{ color: 'var(--headline)' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60" style={{ color: 'var(--headline)' }}>Role</label>
              <select
                name="role"
                autoComplete="off"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] outline-none transition-all text-sm appearance-none"
                style={{ color: 'var(--headline)', backgroundColor: 'var(--bg-color)' }}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-4 rounded font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-95 transition-all mt-6"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              Verify & Register
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] font-medium" style={{ color: 'var(--paragraph)' }}>
            Already have an account? <a href="/dsw/login" className="font-bold underline underline-offset-4" style={{ color: 'var(--headline)' }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;