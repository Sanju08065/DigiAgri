import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Leaf, ArrowRight, Sprout, CloudRain, IndianRupee } from 'lucide-react';

const features = [
  { icon: Sprout, label: 'Smart Crop Advisor', desc: 'ICAR-based recommendations for your soil & season' },
  { icon: CloudRain, label: 'Live Weather', desc: 'Real-time weather with farming advisories' },
  { icon: IndianRupee, label: 'Govt Schemes', desc: '8 active Central Government schemes' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Welcome back, ' + user.name.split(' ')[0] + '!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left dark panel ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col" style={{ background: '#0f1923' }}>
        {/* subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          width: '52%'
        }} />

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg leading-none">AgriSupport</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Digital Agriculture Platform</p>
            </div>
          </div>

          {/* Hero */}
          <motion.div className="flex-1" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold"
              style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', color: '#4ade80' }}>
              India's #1 Farmer Support Platform
            </div>

            <h1 className="text-5xl font-extrabold leading-tight mb-5 text-white">
              Grow Smarter,<br />
              <span style={{ background: 'linear-gradient(90deg, #4ade80, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Farm Better
              </span>
            </h1>

            <p className="text-base leading-relaxed mb-10 max-w-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Access crop recommendations, government schemes, weather insights, and expert support — all in one place.
            </p>

            {/* Feature list */}
            <div className="space-y-3 mb-12">
              {features.map((f, i) => (
                <motion.div key={f.label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(22,163,74,0.2)' }}>
                    <f.icon className="w-4.5 h-4.5 text-green-400 w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[['9.8Cr+', 'Farmers Served'], ['₹3.46L Cr', 'Disbursed'], ['8', 'Live Schemes'], ['16+', 'Crop Types']].map(([v, l]) => (
                <div key={l} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-2xl font-extrabold text-white">{v}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="text-xs mt-8" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2025 AgriSupport · Government of India Initiative</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)' }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AgriSupport</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-8">Welcome back — enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                  className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-sm outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 shadow-sm"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold text-sm transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #16a34a, #10b981)', boxShadow: '0 4px 16px rgba(22,163,74,0.35)' }}>
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 rounded-2xl p-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-xs font-bold text-green-800 uppercase tracking-widest mb-3">Demo Access</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@agri.com', pw: 'admin123', color: '#4f46e5' },
                { role: 'Farmer', email: 'farmer@agri.com', pw: 'farmer123', color: '#16a34a' },
              ].map(d => (
                <button key={d.role} type="button" onClick={() => { setEmail(d.email); setPassword(d.pw); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition text-left">
                  <span className="text-xs font-bold" style={{ color: d.color }}>{d.role}</span>
                  <span className="text-xs text-gray-400 font-mono">{d.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            New here?{' '}
            <Link to="/register" className="text-green-600 font-bold hover:underline">Create free account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
