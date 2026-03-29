import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Landmark, Plus, X, Pencil, Trash2, Users, Calendar, CheckCircle } from 'lucide-react';

const emptyForm = { title: '', description: '', eligibility: '', benefits: '', deadline: '' };

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchemes = () => {
    API.get('/schemes').then(({ data }) => setSchemes(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSchemes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.eligibility || !form.benefits) return toast.error('Fill all required fields');
    setSubmitting(true);
    try {
      if (editingId) {
        await API.put(`/schemes/${editingId}`, form);
        toast.success('Scheme updated');
      } else {
        await API.post('/schemes', form);
        toast.success('Scheme created');
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      fetchSchemes();
    } catch { toast.error('Operation failed'); }
    finally { setSubmitting(false); }
  };

  const handleEdit = (s) => {
    setForm({ title: s.title, description: s.description, eligibility: s.eligibility, benefits: s.benefits, deadline: s.deadline ? s.deadline.split('T')[0] : '' });
    setEditingId(s._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this scheme?')) return;
    try {
      await API.delete(`/schemes/${id}`);
      toast.success('Scheme deleted');
      fetchSchemes();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-4xl">
      <div className="h-7 w-48 bg-gray-200 rounded-lg" />
      {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
    </div>
  );

  const fields = [
    { key: 'title', label: 'Scheme Title', type: 'text', required: true, placeholder: 'e.g. PM-KISAN Samman Nidhi Yojana' },
    { key: 'description', label: 'Description', type: 'textarea', required: true, placeholder: 'Detailed description of the scheme...' },
    { key: 'eligibility', label: 'Eligibility Criteria', type: 'textarea', required: true, placeholder: 'Who can apply for this scheme...' },
    { key: 'benefits', label: 'Benefits & Financial Support', type: 'textarea', required: true, placeholder: 'What farmers will receive...' },
    { key: 'deadline', label: 'Application Deadline', type: 'date' },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-emerald-500" />Scheme Management
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{schemes.length} active schemes</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${showForm ? 'bg-gray-100 text-gray-700' : 'bg-gradient-to-r from-emerald-500 to-primary-600 text-white shadow-glow-green'}`}>
          {showForm ? <><X className="w-4 h-4" />Cancel</> : <><Plus className="w-4 h-4" />Add Scheme</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">{editingId ? 'Edit Scheme' : 'New Government Scheme'}</h3>
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea rows={3} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none bg-gray-50 placeholder:text-gray-400" />
                  ) : (
                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-gray-50 placeholder:text-gray-400" />
                  )}
                </div>
              ))}
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-primary-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
                {submitting ? 'Saving...' : editingId ? 'Update Scheme' : 'Create Scheme'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {schemes.map((s, i) => (
          <motion.div key={s._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-gray-800">{s.title}</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">Active</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{s.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.applicants?.length || 0} applicants</span>
                  {s.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {new Date(s.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-3 h-3" />Central Govt Scheme</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(s)}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(s._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
