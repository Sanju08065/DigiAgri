import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { MessageSquareWarning, Plus, X, Upload, Clock, CheckCircle, AlertCircle, XCircle, ChevronDown, Image } from 'lucide-react';

const statusConfig = {
  pending:     { color: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-400',  icon: Clock,         label: 'Pending' },
  'in-progress':{ color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-400',   icon: AlertCircle,   label: 'In Progress' },
  resolved:    { color: 'bg-green-100 text-green-700 border-green-200',  dot: 'bg-green-400',  icon: CheckCircle,   label: 'Resolved' },
  rejected:    { color: 'bg-red-100 text-red-700 border-red-200',        dot: 'bg-red-400',    icon: XCircle,       label: 'Rejected' },
};

const categories = ['pest', 'irrigation', 'soil', 'equipment', 'other'];

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'other' });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/my');
      setComplaints(data);
    } catch { toast.error('Failed to load complaints'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('Title and description are required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      files.forEach(f => fd.append('images', f));
      await API.post('/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Complaint submitted successfully');
      setShowForm(false);
      setForm({ title: '', description: '', category: 'other' });
      setFiles([]);
      fetchComplaints();
    } catch { toast.error('Failed to submit complaint'); }
    finally { setSubmitting(false); }
  };

  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-3xl">
      <div className="h-7 w-48 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-4 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 rounded-xl" />)}</div>
      {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <MessageSquareWarning className="w-6 h-6 text-amber-500" />Support & Complaints
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Raise issues and track their resolution status</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${showForm ? 'bg-gray-100 text-gray-700' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-green'}`}>
          {showForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />New Complaint</>}
        </motion.button>
      </div>

      {/* Status summary */}
      {complaints.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <div key={key} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${cfg.color}`}>
              <cfg.icon className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="text-lg font-bold leading-none">{statusCounts[key] || 0}</p>
                <p className="text-xs mt-0.5 opacity-80">{cfg.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New complaint form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">New Complaint</h3>
              <input type="text" placeholder="Complaint title (e.g. Aphid infestation on wheat crop)" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none bg-gray-50 placeholder:text-gray-400" />
              <textarea placeholder="Describe your issue in detail — include crop name, affected area, symptoms observed..." rows={4}
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none bg-gray-50 placeholder:text-gray-400" />
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white capitalize">
                    {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Attach Images</label>
                  <label className="flex items-center gap-2 px-3 py-2.5 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition text-sm text-gray-500">
                    {files.length > 0
                      ? <><Image className="w-4 h-4 text-primary-500" />{files.length} image(s) selected</>
                      : <><Upload className="w-4 h-4" />Upload photos</>}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => setFiles([...e.target.files])} />
                  </label>
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaints list */}
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MessageSquareWarning className="w-7 h-7 text-amber-400" />
            </div>
            <p className="text-gray-600 font-medium">No complaints yet</p>
            <p className="text-gray-400 text-sm mt-1">Click "New Complaint" to raise an issue</p>
          </div>
        ) : complaints.map((c, i) => {
          const cfg = statusConfig[c.status] || statusConfig.pending;
          const isOpen = expanded === c._id;
          return (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
              <button className="w-full text-left px-5 py-4 flex items-start gap-4" onClick={() => setExpanded(isOpen ? null : c._id)}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-800">{c.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 capitalize">{c.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}>
                    <cfg.icon className="w-3 h-3" />{cfg.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-50">
                    <div className="px-5 py-4 space-y-3">
                      <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>
                      {c.adminResponse && (
                        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-blue-700 mb-0.5">Admin Response</p>
                            <p className="text-xs text-blue-600 leading-relaxed">{c.adminResponse}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
