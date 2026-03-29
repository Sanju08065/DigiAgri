import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Sprout, Search, Leaf, MapPin, Sun, Layers, Clock, Droplets, TrendingUp, Info, IndianRupee, Lightbulb } from 'lucide-react';

const up = (i=0) => ({ initial:{opacity:0,y:14}, animate:{opacity:1,y:0}, transition:{duration:0.3,delay:i*0.07} });

const cropGradients = [
  'from-emerald-500 to-green-400',
  'from-lime-500 to-emerald-400',
  'from-teal-500 to-cyan-400',
  'from-green-600 to-emerald-500',
  'from-primary-600 to-emerald-500',
  'from-cyan-500 to-teal-400',
];

export default function CropRecommendation() {
  const [soilTypes, setSoilTypes] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ soilType: '', season: '', region: '' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/crops/soil-types'), API.get('/crops/seasons'), API.get('/crops/regions')])
      .then(([s, sz, r]) => { setSoilTypes(s.data); setSeasons(sz.data); setRegions(r.data); })
      .finally(() => setFetching(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.soilType || !form.season || !form.region) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await API.post('/crops/recommend', form);
      setResults(data);
      if (!data.length) toast('No crops matched this combination', { icon: '🤔' });
      else toast.success(`Found ${data.length} crop recommendations`);
    } catch { toast.error('Failed to get recommendations'); }
    finally { setLoading(false); }
  };

  const scoreLabel = (score) => {
    if (score >= 5) return { label: 'Highly Suitable', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (score >= 3) return { label: 'Suitable', cls: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Possible', cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  };

  const selSoil = soilTypes.find(s => s.value === form.soilType);
  const selSeason = seasons.find(s => s.value === form.season);
  const selRegion = regions.find(r => r.value === form.region);

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div {...up(0)}>
        <h2 className="page-title flex items-center gap-2"><Sprout className="w-6 h-6 text-primary-600" />Crop Recommendation</h2>
        <p className="page-subtitle">ICAR-based recommendations for Indian soil, season & region conditions</p>
      </motion.div>

      {/* Form card */}
      <motion.div {...up(1)} className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-emerald-500 px-6 py-4">
          <p className="text-white font-bold text-sm">Select Your Farm Conditions</p>
          <p className="text-white/70 text-xs mt-0.5">Choose soil type, cropping season, and your region</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: 'soilType', label: 'Soil Type', icon: Layers, iconColor: 'text-amber-500', options: soilTypes, sel: selSoil },
              { key: 'season', label: 'Cropping Season', icon: Sun, iconColor: 'text-yellow-500', options: seasons, sel: selSeason, extra: (o) => ` (${o.period})` },
              { key: 'region', label: 'Region', icon: MapPin, iconColor: 'text-red-500', options: regions, sel: selRegion, extra: (o) => ` — ${o.states}` },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                  <f.icon className={`w-3.5 h-3.5 ${f.iconColor}`} />{f.label}
                </label>
                <select value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="input-base">
                  <option value="">Select {f.label.toLowerCase()}</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}{f.extra ? f.extra(o) : ''}</option>)}
                </select>
                {f.sel && (
                  <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-1 leading-relaxed">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />{f.sel.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading || fetching} className="btn-primary">
            <Search className="w-4 h-4" />{loading ? 'Analysing...' : 'Get Recommendations'}
          </motion.button>
        </form>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">
                {results.length} Crops Recommended
                <span className="text-gray-400 font-normal ml-2">— sorted by suitability</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map((crop, i) => {
                const suit = scoreLabel(crop.score);
                const grad = cropGradients[i % cropGradients.length];
                return (
                  <motion.div key={crop.crop} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-lg transition-shadow duration-300">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${grad} p-4 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-base">{crop.crop}</h4>
                          <p className="text-white/70 text-xs italic">{crop.scientificName}</p>
                        </div>
                      </div>
                      <span className={`badge border ${suit.cls}`}>{suit.label}</span>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-xs text-gray-600 leading-relaxed">{crop.description}</p>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: Clock, label: 'Duration', val: crop.duration, color: 'text-blue-500', bg: 'bg-blue-50' },
                          { icon: Droplets, label: 'Water', val: crop.waterRequirement, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                          { icon: TrendingUp, label: 'Yield', val: crop.yield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                          { icon: Sun, label: 'Temp', val: crop.temperature, color: 'text-amber-500', bg: 'bg-amber-50' },
                        ].map(s => (
                          <div key={s.label} className={`flex items-center gap-2 ${s.bg} rounded-xl p-2.5`}>
                            <s.icon className={`w-3.5 h-3.5 ${s.color} flex-shrink-0`} />
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-400 font-semibold uppercase">{s.label}</p>
                              <p className="text-xs text-gray-700 font-semibold truncate">{s.val}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* MSP */}
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <IndianRupee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-800"><span className="font-bold">MSP 2024–25:</span> {crop.msp2025}</p>
                      </div>

                      {/* Tips */}
                      <div className="flex items-start gap-2 bg-primary-50 border border-primary-100 rounded-xl p-3">
                        <Lightbulb className="w-3.5 h-3.5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-primary-800 leading-relaxed">{crop.tips}</p>
                      </div>

                      {/* State tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {crop.states.slice(0, 4).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium">{s}</span>
                        ))}
                        {crop.states.length > 4 && <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-[10px]">+{crop.states.length - 4} more</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
