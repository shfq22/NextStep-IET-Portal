import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Home, LogOut, MessageCircle, UserCircle } from 'lucide-react';
import { usePlacement } from '../PlacementContext';

export default function PlacementShell({ children, showStudentNav = false, showAlumniNav = false }) {
  const navigate = useNavigate();
  const { studentUser, alumniUser, logoutStudent, logoutAlumni, studentNotifications } = usePlacement();
  const unread = studentNotifications.filter((n) => !n.read).length;

  const handleExit = () => {
    logoutStudent();
    logoutAlumni();
    navigate('/placement');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--paragraph)' }}>
      <header
        className="sticky top-0 z-40 border-b border-[var(--tertiary)] backdrop-blur-md bg-opacity-90"
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 opacity-70 hover:opacity-100 text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--headline)' }}>
            <Home size={14} />
            Hub
          </Link>
          <Link to="/placement" className="flex items-center gap-2 font-bold text-sm" style={{ color: 'var(--headline)' }}>
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black" style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}>
              PP
            </span>
            Placement Portal
          </Link>
          <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {showStudentNav && studentUser && (
              <>
                <NavLink
                  to="/placement/student"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${isActive ? '' : 'opacity-50 hover:opacity-100'}`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--btn-bg)' : 'transparent',
                    color: isActive ? 'var(--btn-text)' : 'var(--headline)',
                  })}
                >
                  Discover
                </NavLink>
                <NavLink
                  to="/placement/student/chat"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1 ${isActive ? '' : 'opacity-50 hover:opacity-100'}`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--btn-bg)' : 'transparent',
                    color: isActive ? 'var(--btn-text)' : 'var(--headline)',
                  })}
                >
                  <MessageCircle size={14} />
                  AI Mentor
                </NavLink>
              </>
            )}
            {showAlumniNav && alumniUser && (
              <NavLink
                to="/placement/alumni/profile"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs font-bold transition-colors inline-flex items-center gap-1 ${isActive ? '' : 'opacity-50 hover:opacity-100'}`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--btn-bg)' : 'transparent',
                  color: isActive ? 'var(--btn-text)' : 'var(--headline)',
                })}
              >
                <UserCircle size={14} />
                My profile &amp; inbox
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {showStudentNav && studentUser && unread > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--secondary)', color: 'var(--headline)' }}>
                {unread} update{unread !== 1 ? 's' : ''}
              </span>
            )}
            {(studentUser || alumniUser) && (
              <button
                type="button"
                onClick={handleExit}
                className="flex items-center gap-1 text-xs font-bold opacity-60 hover:opacity-100"
                style={{ color: 'var(--headline)' }}
              >
                <LogOut size={14} />
                Exit
              </button>
            )}
            <Briefcase size={16} className="opacity-30 hidden md:block" />
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
