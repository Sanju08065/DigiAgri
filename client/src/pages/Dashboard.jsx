import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Cloud, Droplets, Wind, Thermometer, Sprout, Landmark, MessageSquareWarning, ArrowUpRight, Sun, CloudRain, TrendingUp, CheckCircle, Clock, Bell, Zap } from "lucide-react";

const up = (i = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: i * 0.07 } });
const weatherIcon = { Sunny: Sun, "Partly Cloudy": Cloud, Cloudy: Cloud, "Light Rain": CloudRain, Clear: Sun };

export default function Dashboard() {
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/weather", { params: { location: user?.location?.split(",")[0]?.trim() || "New Delhi" } }),
      API.get("/users/stats"),
    ]).then(([w, s]) => { setWeather(w.data); setStats(s.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const notifications = [
    { id: 1, text: "PM-KISAN 20th instalment expected June-July 2025", time: "2h ago", type: "info", icon: Landmark },
    { id: 2, text: "PMFBY Kharif 2025 enrollment deadline: 31 July 2025", time: "5h ago", type: "warning", icon: Clock },
    { id: 3, text: "Your complaint has been reviewed by admin", time: "1d ago", type: "success", icon: CheckCircle },
    { id: 4, text: "Kharif sowing advisory: Sow by mid-June for best yield", time: "2d ago", type: "info", icon: Sprout },
  ];

  const notifStyle = {
    info: { bg: "bg-blue-50", text: "text-blue-600" },
    warning: { bg: "bg-amber-50", text: "text-amber-600" },
    success: { bg: "bg-emerald-50", text: "text-emerald-600" },
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const WeatherIcon = weatherIcon[weather?.condition] || Cloud;

  const cards = [
    { label: "Active Schemes", value: stats?.totalSchemes || 8, sub: "Central Govt", icon: Landmark, to: "/schemes", bg: "from-[#6366f1] to-[#8b5cf6]" },
    { label: "Crop Varieties", value: "16+", sub: "ICAR Approved", icon: Sprout, to: "/crops", bg: "from-[#10b981] to-[#059669]" },
    { label: "Support Tickets", value: stats?.totalComplaints || 0, sub: "Track status", icon: MessageSquareWarning, to: "/complaints", bg: "from-[#f59e0b] to-[#ef4444]" },
    { label: "Pending Issues", value: stats?.pendingComplaints || 0, sub: "Needs attention", icon: Clock, to: "/complaints", bg: "from-[#ec4899] to-[#f43f5e]" },
  ];

  const quickActions = [
    { label: "Crop Advice", icon: Sprout, to: "/crops", bg: "bg-emerald-50 hover:bg-emerald-100 border-emerald-100", ic: "text-emerald-600", ibg: "bg-emerald-100" },
    { label: "View Schemes", icon: Landmark, to: "/schemes", bg: "bg-violet-50 hover:bg-violet-100 border-violet-100", ic: "text-violet-600", ibg: "bg-violet-100" },
    { label: "Raise Issue", icon: MessageSquareWarning, to: "/complaints", bg: "bg-amber-50 hover:bg-amber-100 border-amber-100", ic: "text-amber-600", ibg: "bg-amber-100" },
    { label: "Weather", icon: Cloud, to: "/dashboard", bg: "bg-sky-50 hover:bg-sky-100 border-sky-100", ic: "text-sky-600", ibg: "bg-sky-100" },
  ];

  if (loading) return (
    <div className="space-y-5 animate-pulse max-w-6xl">
      <div className="h-24 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-72 bg-gray-200 rounded-2xl" />
        <div className="h-72 bg-gray-200 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-6xl">
      <motion.div {...up(0)} className="relative overflow-hidden rounded-2xl p-6 text-white" style={{ background: '#0f1923' }}>
        <div className="absolute inset-0 bg-dots bg-dots opacity-100" />
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary-500/10 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/50 text-sm mb-1">{greeting} wave</p>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{user?.name}</h2>
            <p className="text-white/40 text-xs mt-1">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {user?.location && <span className="ml-2">- {user.location}</span>}
            </p>
          </div>
          <Link to="/crops" className="hidden sm:flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 hover:bg-primary-500/30 transition rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-300">
            <Zap className="w-4 h-4" />Get Crop Advice
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...up(i + 1)}>
            <Link to={c.to} className="block">
              <div className={"stat-card bg-gradient-to-br " + c.bg}>
                <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                      <c.icon className="w-[18px] h-[18px] text-white" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/50" />
                  </div>
                  <p className="text-3xl font-black text-white">{c.value}</p>
                  <p className="text-white/80 text-xs font-semibold mt-0.5">{c.label}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{c.sub}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {weather && (
          <motion.div {...up(5)} className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl h-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">
              <div className="absolute inset-0 bg-grid bg-grid opacity-100" />
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-sky-200 text-xs font-bold uppercase tracking-wider">Live Weather</p>
                    <p className="text-white font-bold text-lg mt-0.5">{weather.location}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <WeatherIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex items-end gap-3 mb-5">
                  <span className="text-7xl font-black text-white tracking-tighter leading-none">{weather.temperature}</span>
                  <div className="mb-2">
                    <p className="text-sky-200 font-semibold">{weather.condition}</p>
                    <p className="text-sky-300/60 text-xs">Celsius</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: Droplets, label: "Humidity", val: weather.humidity + "%" },
                    { icon: Wind, label: "Wind", val: weather.windSpeed + " km/h" },
                    { icon: Thermometer, label: "Feels like", val: (weather.feelsLike || weather.temperature - 2) + "°C" },
                  ].map(item => (
                    <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center">
                      <item.icon className="w-4 h-4 text-sky-300 mx-auto mb-1.5" />
                      <p className="text-white font-bold text-sm">{item.val}</p>
                      <p className="text-sky-300/70 text-[10px] mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                  {weather.forecast.map(f => (
                    <div key={f.day} className="flex-shrink-0 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2.5 text-center min-w-[60px]">
                      <p className="text-sky-300 text-[10px] font-bold">{f.day}</p>
                      <p className="text-white font-bold text-sm mt-1">{f.temp}°</p>
                      <p className="text-sky-300/60 text-[10px]">{f.condition?.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 border border-white/15 rounded-xl p-3 flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sky-100 text-xs leading-relaxed">{weather.advisory}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <motion.div {...up(6)}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span className="text-sm font-bold text-gray-800">Notifications</span>
              </div>
              <span className="badge bg-red-100 text-red-600">{notifications.length} new</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {notifications.map(n => {
                const s = notifStyle[n.type];
                return (
                  <div key={n.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/80 transition-colors">
                    <div className={"w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 " + s.bg}>
                      <n.icon className={"w-3.5 h-3.5 " + s.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
              <button className="text-xs text-primary-600 font-bold hover:underline">View all</button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div {...up(7)}>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(a => (
            <Link key={a.label} to={a.to} className={"flex flex-col items-center gap-2.5 p-4 border rounded-2xl text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md " + a.bg}>
              <div className={"w-10 h-10 rounded-xl flex items-center justify-center " + a.ibg}>
                <a.icon className={"w-5 h-5 " + a.ic} />
              </div>
              <span className="text-xs font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
