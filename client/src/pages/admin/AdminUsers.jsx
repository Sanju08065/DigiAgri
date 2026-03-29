import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import { Users, Mail, MapPin, Calendar, Search, Shield, Sprout } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/users').then(({ data }) => setUsers(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.location || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-48 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-xl" />
      {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}
    </div>
  );

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const gradients = ['from-blue-400 to-indigo-500', 'from-emerald-400 to-primary-500', 'from-amber-400 to-orange-500', 'from-purple-400 to-pink-500', 'from-sky-400 to-blue-500'];

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />User Management
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input type="text" placeholder="Search by name, email or location..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none shadow-sm placeholder:text-gray-400" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['User', 'Email', 'Role', 'Location', 'Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u, i) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {initials(u.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />{u.email}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <Sprout className="w-3 h-3" />}{u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />{u.location || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No users match your search</div>
          )}
        </div>
      </div>
    </div>
  );
}
