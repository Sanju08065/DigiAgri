import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sprout, MessageSquareWarning, Landmark, LogOut, Menu, X, Leaf, Shield, Bell, ChevronRight } from 'lucide-react';

const DARK = '#0f1923';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#6366f1' },
  { to: '/crops', label: 'Crop Advisor', icon: Sprout, color: '#10b981' },
  { to: '/complaints', label: 'Support', icon: MessageSquareWarning, color: '#f59e0b' },
  { to: '/schemes', label: 'Schemes', icon: Landmark, color: '#8b5cf6' },
];

const titles = {
  '/dashboard': 'Dashboard',
  '/crops': 'Crop Advisor',
  '/complaints': 'Support & Complaints',
  '/schemes': 'Government Schemes',
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
            style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)', boxShadow: '0 0 16px rgba(22,163,74,0.4)' }}>
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">AgriSupport</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Digital Agriculture</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg transition" style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav label */}
      <p className="px-3 text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Menu</p>

      {/* Nav items */}
      <nav className="space-y-0.5">
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={({ isActive }) => ({
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
            })}>
            {({ isActive }) => (
              <>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
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

      {/* Admin link */}
      {user?.role === 'admin' && (
        <>
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest mt-5 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Admin</p>
          <NavLink to="/admin" onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={({ isActive }) => ({
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
            })}>
            {({ isActive }) => (
              <>
                <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isActive ? '#6366f1' : 'rgba(255,255,255,0.07)' }}>
                  <Shield className="w-4 h-4 text-white" />
                </span>
                <span className="flex-1">Admin Panel</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.4)' }} />}
              </>
            )}
          </NavLink>
        </>
      )}

      <div className="flex-1" />

      {/* User card */}
      <div className="mt-4 pt-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-xs truncate capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>{user?.location || user?.role}</p>
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

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const title = titles[location.pathname] || 'AgriSupport';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[220px] flex-shrink-0 h-full">
        <SidebarInner />
      </aside>

      {/* Mobile overlay */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
              <Leaf className="w-3.5 h-3.5 text-green-500" />
              <span>AgriSupport</span>
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
              style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
