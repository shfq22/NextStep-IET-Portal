


import React, { useState, useRef, useEffect } from 'react';
import { Bell, UserCircle, Search, LogOut, User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName = 'User', role = 'student', onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className="h-16 border-b border-[var(--tertiary)] flex items-center justify-between px-8 sticky top-0 z-50 transition-colors duration-500" 
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      {/* Global Search */}
      <div className="relative w-96 group hidden md:block">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none opacity-40">
          <Search size={14} style={{ color: 'var(--headline)' }} />
        </div>
        <input 
          className="block w-full pl-10 pr-12 py-2 rounded border border-[var(--tertiary)] bg-transparent focus:border-[var(--headline)] transition-all outline-none text-[13px] font-medium tracking-tight shadow-sm" 
          style={{ color: 'var(--headline)' }}
          placeholder="Search portal (⌘K)..." 
        />
      </div>

      {/* Right Utility Section */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 rounded hover:bg-[var(--secondary)] transition-all group border border-transparent hover:border-[var(--tertiary)]">
          <Bell style={{ color: 'var(--headline)' }} size={18} className="opacity-70 group-hover:opacity-100" />
          <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--btn-bg)' }}></span>
        </button>

        <div className="h-6 w-[1px] bg-[var(--tertiary)] mx-1"></div>
        
        {/* Profile Section with Dropdown Logic */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 pl-2 group cursor-pointer select-none"
          >
            <div className="text-right leading-none hidden sm:block">
              <p className="text-[12px] font-bold tracking-tight mb-1 uppercase" style={{ color: 'var(--headline)' }}>
                {userName}
              </p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="h-1 w-1 rounded-full bg-green-500"></span>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-50" style={{ color: 'var(--paragraph)' }}>
                  {role}
                </p>
              </div>
            </div>
            
            <div 
              className={`w-9 h-9 rounded flex items-center justify-center border transition-all overflow-hidden ${isDropdownOpen ? 'border-[var(--headline)] ring-2 ring-[var(--tertiary)]' : 'border-[var(--tertiary)] group-hover:border-[var(--headline)]'}`} 
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <UserCircle size={24} style={{ color: 'var(--headline)' }} className="opacity-70" />
            </div>
          </div>

          {/* Professional Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="absolute right-0 mt-3 w-56 rounded border border-[var(--tertiary)] shadow-xl animate-in fade-in zoom-in duration-150 py-2 z-50 overflow-hidden"
              style={{ backgroundColor: 'var(--sidebar-bg)' }}
            >
              <div className="px-4 py-3 border-b border-[var(--tertiary)] mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1" style={{ color: 'var(--paragraph)' }}>Signed in as</p>
                <p className="text-xs font-bold truncate" style={{ color: 'var(--headline)' }}>{userName}</p>
              </div>

              <button
                onClick={() => {
                  const base = role === 'admin' ? '/dsw/admin' : role === 'teacher' ? '/dsw/teacher' : '/dsw/student';
                  navigate(`${base}/profile`);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold hover:bg-[var(--secondary)] transition-colors group" style={{ color: 'var(--headline)' }}
              >
                <User size={14} className="opacity-50 group-hover:opacity-100" />
                Profile Settings
              </button>
              
              <button
                onClick={() => {
                  const base = role === 'admin' ? '/dsw/admin' : role === 'teacher' ? '/dsw/teacher' : '/dsw/student';
                  navigate(`${base}/security`);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold hover:bg-[var(--secondary)] transition-colors group" style={{ color: 'var(--headline)' }}
              >
                <Shield size={14} className="opacity-50 group-hover:opacity-100" />
                Privacy & Security
              </button>

              <div className="h-[1px] bg-[var(--tertiary)] my-2"></div>

              <button 
                onClick={() => {
                  if (onSignOut) onSignOut();
                  navigate('/dsw/login');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
              >
                <LogOut size={14} className="opacity-70 group-hover:opacity-100" />
                Sign Out System
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;