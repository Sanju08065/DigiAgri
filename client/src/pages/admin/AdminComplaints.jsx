import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { MessageSquareWarning, CheckCircle, Clock, AlertCircle, XCircle, Search, Filter } from 'lucide-react';

const statusConfig = {
  pending:      { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock,         label: 'Pending' },
  'in-progress':{ color: 'bg-blue-100 text-blue-700 border-blue-200',    icon: AlertCircle,   label: 'In Progress' },
  resolved:     { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle,   label: 'Resolved' },
  rejected:     { color: 'bg-red-100 text-red-700 border-red-200',       icon: XCircle,       label: 'Rejected' },
};

const statusOptions = ['pending', 'in-progress', 'resolved', 'rejected'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [responses, setResponses] = useState({});

  const fetchComplaints = () => {
    API.get('/complaints').then(({ data }) => {
      setComplaints(data);
      const initial = {};
      data.forEach(c => { initial[c._id] = c.adminResponse || ''; });
      setResponses(initial);
    }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await API.patch(`/complaints/${id}`, { status, adminResponse: responses[id] || '' });
      toast.success('Updated successfully');
      fetchComplaints();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = complaints.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.user?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-4xl">
      <div className="h-7 w-48 bg-gray-200 rounded-lg" />
      <div className="h-10 bg-gray-200 rounded-xl" />
      {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-500" />Complaint Management
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{complaints.length} total · {complaints.filter(c => c.status === 'pending').length} pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm placeholder:text-gray-400" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none shadow-sm capitalize appearance-none">
            <option value="all">All Status</option>
            {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">No complaints match your filters</div>
        ) : filtered.map((c, i) => {
          const cfg = statusConfig[c.status] || statusConfig.pending;
          return (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-gray-800">{c.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 capitalize">{c.category}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {c.user?.name || 'Unknown'} · {c.user?.email} · {c.user?.location || 'N/A'} ·{' '}
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${cfg.color}`}>
                  <cfg.icon className="w-3 h-3" />{cfg.label}
                </span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-xl p-3">{c.description}</p>

              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Update Status</label>
                  <select defaultValue={c.status} onChange={e => handleUpdate(c._id, e.target.value)}
                    disabled={updating === c._id}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white capitalize shadow-sm">
                    {statusOptions.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[220px]">
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Admin Response</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Type your response to the farmer..."
                      value={responses[c._id] || ''}
                      onChange={e => setResponses({ ...responses, [c._id]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm placeholder:text-gray-400" />
                    <button onClick={() => handleUpdate(c._id, c.status)} disabled={updating === c._id}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 whitespace-nowrap">
                      {updating === c._id ? '...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
