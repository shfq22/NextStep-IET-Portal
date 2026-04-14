

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Ticket, 
  FileUp, 
  MessagesSquare, 
  Moon, 
  Sun,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const Sidebar = ({ theme, toggleTheme, role = 'student' }) => {
  const studentMenu = [
    { name: 'Dashboard', path: '/dsw/student', icon: <LayoutDashboard size={18} /> },
    { name: 'Scholarships', path: '/dsw/student/scholarships', icon: <FileUp size={18} /> },
    { name: 'Upload Tickets', path: '/dsw/student/doc-tickets', icon: <FileCheck size={18} /> },
    { name: 'Announcements', path: '/dsw/student/announcements', icon: <Megaphone size={18} /> },
    { name: 'Community Forum', path: '/dsw/student/forum', icon: <MessagesSquare size={18} /> },
  ];

  const adminMenu = [
    { name: 'Dashboard', path: '/dsw/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Pending Grievances', path: '/dsw/admin/grievances', icon: <Ticket size={18} /> },
    { name: 'Scholarship Review', path: '/dsw/admin/scholarships', icon: <FileUp size={18} /> },
    { name: 'Doc Tickets', path: '/dsw/admin/doc-tickets', icon: <FileCheck size={18} /> },
    { name: 'Student Doubts', path: '/dsw/admin/forum', icon: <MessagesSquare size={18} /> },
    { name: 'Announcements', path: '/dsw/admin/announcements', icon: <Megaphone size={18} /> },
  ];

  const menuItems = role === 'admin' ? adminMenu : studentMenu;

  return (
    <aside 
      className="w-64 h-screen sticky top-0 border-r border-[var(--tertiary)] flex flex-col transition-colors duration-500 z-50" 
      style={{ backgroundColor: 'var(--secondary)' }}
    >
      {/* Institutional Branding */}
      <div className="p-8 mb-4 flex items-center gap-3 border-b border-[var(--tertiary)]">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/47/Ietlogo.png"
          alt="IET Logo"
          className="w-9 h-9 object-contain"
        />
        <div className="leading-none">
          <h1 className="font-bold text-sm tracking-tighter" style={{ color: 'var(--headline)' }}>IET LUCKNOW</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40" style={{ color: 'var(--paragraph)' }}>
            {role === 'admin' ? 'Admin Console' : 'Student Portal'}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dsw/student' || item.path === '/dsw/admin'}
            className={({ isActive }) => `
              w-full flex items-center gap-4 px-4 py-3 rounded transition-all duration-200 group
              ${isActive 
                ? 'font-bold' 
                : 'font-medium opacity-90 hover:opacity-60 hover:bg-[var(--bg-color)]'
              }
            `}
            style={({ isActive }) => ({ 
              backgroundColor: isActive ? 'var(--btn-bg)' : 'transparent',
              color: isActive ? 'var(--btn-text)' : 'var(--headline)'
            })}
          >
            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="text-[13px] tracking-tight">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Security Footer & Theme Toggle */}
      <div className="p-6 border-t border-[var(--tertiary)] space-y-4">
        <div className="flex items-center gap-3 px-2 mb-2 opacity-40">
          <ShieldCheck size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Secure</span>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded border border-[var(--tertiary)] hover:bg-[var(--secondary)] transition-all group"
          style={{ color: 'var(--headline)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-widest">
            {theme === 'light' ? 'Night Mode' : 'Day Mode'}
          </span>
          {theme === 'light' ? 
            <Moon size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" /> : 
            <Sun size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          }
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;