import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { Users, MessageSquareWarning, Landmark, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const up = (i=0) => ({ initial:{opacity:0,y:14}, animate:{opacity:1,y:0}, transition:{duration:0.3,delay:i*0.07} });

const Tip = ({ active, payload, label }) => active && payload?.length ? (
  <div className="bg-white border border-gray-100 rounded-xl shadow-card px-3 py-2">
    <p className="text-xs font-bold text-gray-700">{label}</p>
    <p className="text-base font-black text-indigo-600">{payload[0].value}</p>
  </div>
) : null;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/users/stats').then(({data})=>setStats(data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);

  if (loading) return (
    <div className="space-y-5 animate-pulse max-w-5xl">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-28 bg-gray-200 rounded-2xl"/>)}</div>
      <div className="h-72 bg-gray-200 rounded-2xl"/>
    </div>
  );

  const cards = [
    { label:'Total Users', value:stats?.totalUsers||0, icon:Users, bg:'from-[#6366f1] to-[#8b5cf6]', link:'/admin/users', note:'Registered' },
    { label:'Total Complaints', value:stats?.totalComplaints||0, icon:MessageSquareWarning, bg:'from-[#f59e0b] to-[#ef4444]', link:'/admin/complaints', note:'All time' },
    { label:'Pending Review', value:stats?.pendingComplaints||0, icon:Clock, bg:'from-[#ec4899] to-[#f43f5e]', link:'/admin/complaints', note:'Needs action' },
    { label:'Active Schemes', value:stats?.totalSchemes||0, icon:Landmark, bg:'from-[#10b981] to-[#059669]', link:'/admin/schemes', note:'Live' },
  ];

  const chart = [
    { name:'Users', value:stats?.totalUsers||0, color:'#6366f1' },
    { name:'Complaints', value:stats?.totalComplaints||0, color:'#f59e0b' },
    { name:'Pending', value:stats?.pendingComplaints||0, color:'#ef4444' },
    { name:'Schemes', value:stats?.totalSchemes||0, color:'#10b981' },
  ];

  return (
    <div className="space-y-5 max-w-5xl">
      <motion.div {...up(0)}>
        <h2 className="page-title">Admin Overview</h2>
        <p className="page-subtitle">System-wide statistics and management</p>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c,i) => (
          <motion.div key={c.label} {...up(i+1)}>
            <Link to={c.link} className="block">
              <div className={"stat-card bg-gradient-to-br " + c.bg}>
                <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full"/>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <c.icon className="w-[18px] h-[18px] text-white"/>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-all"/>
                  </div>
                  <p className="text-3xl font-black text-white">{c.value}</p>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">{c.label}</p>
                  <p className="text-white/40 text-[10px] mt-0.5 flex items-center gap-1"><TrendingUp className="w-3 h-3"/>{c.note}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <motion.div {...up(5)} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-gray-800">System Statistics</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time platform data</p>
          </div>
          <span className="badge bg-emerald-100 text-emerald-700">Live</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart} barSize={44}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#94a3b8',fontWeight:600}}/>
            <YAxis axisLine={false} tickLine={false} tick={{fontSize:12,fill:'#94a3b8'}}/>
            <Tooltip content={<Tip/>} cursor={{fill:'#f8fafc',radius:8}}/>
            <Bar dataKey="value" radius={[10,10,0,0]}>
              {chart.map((e,i)=><Cell key={i} fill={e.color}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
