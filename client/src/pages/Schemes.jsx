import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Landmark, Calendar, CheckCircle, Users, ExternalLink, ChevronDown, IndianRupee, Sparkles } from 'lucide-react';

const up = (i=0) => ({ initial:{opacity:0,y:14}, animate:{opacity:1,y:0}, transition:{duration:0.3,delay:i*0.07} });

const schemeColors = [
  'from-[#6366f1] to-[#8b5cf6]',
  'from-[#10b981] to-[#059669]',
  'from-[#f59e0b] to-[#ef4444]',
  'from-[#0ea5e9] to-[#2563eb]',
  'from-[#ec4899] to-[#f43f5e]',
  'from-[#14b8a6] to-[#0891b2]',
  'from-[#8b5cf6] to-[#6366f1]',
  'from-[#f97316] to-[#ef4444]',
];

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [applied, setApplied] = useState(new Set());

  useEffect(() => {
    API.get('/schemes').then(({data}) => setSchemes(data)).catch(() => toast.error('Failed to load schemes')).finally(() => setLoading(false));
  }, []);

  const handleApply = async (id) => {
    try {
      await API.post(`/schemes/${id}/apply`);
      setApplied(prev => new Set([...prev, id]));
      toast.success('Application submitted! You will be contacted by the department.');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply'); }
  };

  if (loading) return (
    <div className="space-y-4 animate-pulse max-w-4xl">
      <div className="h-8 w-64 bg-gray-200 rounded-xl" />
      {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-4xl space-y-5">
      <motion.div {...up(0)}>
        <h2 className="page-title flex items-center gap-2"><Landmark className="w-6 h-6 text-violet-500" />Government Schemes</h2>
        <p className="page-subtitle">Real 2024–25 Central Government schemes for farmer welfare</p>
      </motion.div>

      {/* Stats strip */}
      <motion.div {...up(1)} className="grid grid-cols-3 gap-3">
        {[
          { val: schemes.length, label: 'Active Schemes', color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
          { val: schemes.reduce((a,s) => a + (s.applicants?.length||0), 0), label: 'Total Applicants', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { val: '100%', label: 'Govt Funded', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-4 text-center ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="space-y-3">
        {schemes.map((scheme, i) => {
          const isOpen = expanded === scheme._id;
          const hasApplied = applied.has(scheme._id);
          const grad = schemeColors[i % schemeColors.length];
          return (
            <motion.div key={scheme._id} {...up(i + 2)} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-lg transition-shadow duration-300">
              {/* Color accent bar */}
              <div className={`h-1 bg-gradient-to-r ${grad}`} />
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Landmark className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-sm font-bold text-gray-900">{scheme.title}</h3>
                          <span className="badge bg-emerald-100 text-emerald-700">
                            <Sparkles className="w-2.5 h-2.5" />Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{scheme.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {scheme.deadline && (
                        <span className="badge bg-amber-50 text-amber-700 border border-amber-100">
                          <Calendar className="w-3 h-3" />
                          {new Date(scheme.deadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                        </span>
                      )}
                      <span className="badge bg-blue-50 text-blue-700 border border-blue-100">
                        <IndianRupee className="w-3 h-3" />Central Govt
                      </span>
                      <span className="badge bg-gray-100 text-gray-600">
                        <Users className="w-3 h-3" />{scheme.applicants?.length || 0} applied
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleApply(scheme._id)} disabled={hasApplied}
                        className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${hasApplied ? 'bg-emerald-100 text-emerald-700 cursor-default' : `bg-gradient-to-r ${grad} text-white hover:opacity-90 shadow-md`}`}>
                        {hasApplied ? '✓ Applied' : 'Apply Now'}
                      </motion.button>
                      <button onClick={() => setExpanded(isOpen ? null : scheme._id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-semibold transition">
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        {isOpen ? 'Less' : 'Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-gray-50">
                    <div className="p-5 bg-gray-50/50 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Eligibility</p>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{scheme.eligibility}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <IndianRupee className="w-4 h-4 text-blue-500" />
                            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Benefits</p>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{scheme.benefits}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Official info: agricoop.nic.in · Nearest Krishi Vigyan Kendra</span>
                      </div>
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
