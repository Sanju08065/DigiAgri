import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, MessageSquareWarning, Landmark, Users, LogOut, Menu, X, Shield, ArrowLeft, ChevronRight, Bell } from 'lucide-react';

const DARK = '#0f1923';

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, color: '#6366f1' },
  { to: '/admin/users', label: 'Users', icon: Users, color: '#0ea5e9' },
  { to: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning, color: '#f59e0b' },
  { to: '/admin/schemes', label: 'Schemes', icon: Landmark, color: '#10b981' },
];

const titles = {
  '/admin': 'Admin Overview',
  '/admin/users': 'User Management',
  '/admin/complaints': 'Complaint Management',
  '/admin/schemes': 'Scheme Management',
};

function SidebarInner({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col h-full p-4" style={{ background: DARK }}>
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-1 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Admin Panel</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>AgriSupport</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="px-3 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Management</p>

      <nav className="space-y-0.5">
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={({ isActive }) => ({
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
            })}>
            {({ isActive }) => (
              <>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isActive ? item.color : 'rgba(255,255,255,0.07)' }}>
                  <item.icon className="w-4 h-4 text-white" />
                </span>
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="mt-4 pt-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <NavLink to="/dashboard" onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}>
          <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <ArrowLeft className="w-4 h-4 text-white" />
          </span>
          Farmer View
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl my-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Administrator</p>
          </div>
        </div>

        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all"
          style={{ color: '#f87171' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const title = titles[location.pathname] || 'Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden lg:block w-[220px] flex-shrink-0 h-full">
        <SidebarInner />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed left-0 top-0 bottom-0 w-[220px] z-50 lg:hidden shadow-2xl">
              <SidebarInner onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
            </div>
            <h1 className="text-sm font-bold text-gray-800 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
              <Bell className="w-[18px] h-[18px] text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
