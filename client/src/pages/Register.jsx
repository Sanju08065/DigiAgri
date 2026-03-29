import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, User, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', location: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Ravi Kumar', required: true },
    { key: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@example.com', required: true },
    { key: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: '••••••••', required: true },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 9876543210' },
    { key: 'location', label: 'Location', type: 'text', icon: MapPin, placeholder: 'City, State (e.g. Nashik, Maharashtra)' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-emerald-600 via-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-center items-center p-14 text-center w-full">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-4">Join AgriSupport</h1>
            <p className="text-primary-100 text-base leading-relaxed max-w-xs mx-auto">
              Create your free account and get access to crop recommendations, government schemes, and expert support.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 text-left">
              {['Free crop recommendations', 'Government scheme alerts', 'Direct complaint support', 'Weather advisories'].map(f => (
                <div key={f} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5">
                  <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full flex-shrink-0" />
                  <span className="text-white text-xs font-medium">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md py-4">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">AgriSupport</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-7">Fill in your details to get started for free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}</label>
                <div className="relative">
                  <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-[17px] h-[17px]" />
                  <input type={f.type} value={form[f.key]} onChange={update(f.key)} required={f.required}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm placeholder:text-gray-400"
                    placeholder={f.placeholder} />
                </div>
              </div>
            ))}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-600 to-emerald-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-glow-green disabled:opacity-60 mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating account...</>
                : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
