import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  History, 
  TrendingUp, 
  Users, 
  Briefcase,
  Zap
} from 'lucide-react';

export const RecommendationAnalytics = () => {
  // Mock history data if not in localStorage
  const historyData = [
    { date: '2024-05-01', gaming: 12, student: 45, office: 23, prog: 15 },
    { date: '2024-05-02', gaming: 15, student: 38, office: 28, prog: 18 },
    { date: '2024-05-03', gaming: 22, student: 41, office: 21, prog: 25 },
    { date: '2024-05-04', gaming: 28, student: 35, office: 25, prog: 32 },
    { date: '2024-05-05', gaming: 18, student: 48, office: 18, prog: 21 },
    { date: '2024-05-06', gaming: 25, student: 42, office: 30, prog: 28 },
    { date: '2024-05-07', gaming: 30, student: 30, office: 35, prog: 40 },
  ];

  const popularCategories = [
    { name: 'Student', value: 249, icon: History, color: 'bg-indigo-500' },
    { name: 'Gaming', value: 184, icon: Zap, color: 'bg-blue-500' },
    { name: 'Programming', value: 156, icon: TrendingUp, color: 'bg-emerald-500' },
    { name: 'Office/Work', value: 132, icon: Briefcase, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
               <Users size={32} />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">Requirement Trends</h2>
               <p className="text-sm font-medium text-slate-400">Monitoring user behavior and recommendation density.</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="text-center px-6 border-r border-slate-100">
               <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Avg Sessions/Day</p>
               <p className="text-xl font-black text-slate-900">84.2</p>
            </div>
            <div className="text-center px-6">
               <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Generated</p>
               <p className="text-xl font-black text-slate-900">1,482</p>
            </div>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Category Popularity Area */}
         <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-black text-slate-900 px-4">Popular Profiles</h3>
            <div className="grid grid-cols-1 gap-4">
               {popularCategories.map((cat, i) => (
                 <motion.div 
                    key={cat.name}
                    initial={{ opacity:0, x:-20 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                 >
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${cat.color} flex items-center justify-center text-white shadow-lg`}>
                             <cat.icon size={20} />
                          </div>
                          <span className="text-sm font-black text-slate-900">{cat.name}</span>
                       </div>
                       <span className="text-xs font-bold text-slate-400">{cat.value} hits</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(cat.value / 250) * 100}%` }}
                         transition={{ duration: 1, delay: 0.5 }}
                         className={`h-full ${cat.color}`} 
                       />
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         {/* Time Trend Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Recommendation Frequency</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Historical Growth Over 7 Days</p>
               </div>
               <div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
                  <button className="px-3 py-1 bg-white text-[10px] font-black text-indigo-600 rounded-lg shadow-sm">Weekly</button>
                  <button className="px-3 py-1 text-[10px] font-black text-slate-400 hover:text-slate-600">Monthly</button>
               </div>
            </div>
            
            <div className="flex-1 h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                       tickFormatter={(str) => new Date(str).toLocaleDateString('id-ID', { weekday: 'short' })}
                     />
                     <YAxis hide />
                     <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Bar dataKey="student" stackId="a" fill="#6366f1" radius={[0,0,0,0]} />
                     <Bar dataKey="gaming" stackId="a" fill="#3b82f6" radius={[0,0,0,0]} />
                     <Bar dataKey="office" stackId="a" fill="#10b981" radius={[0,0,0,0]} />
                     <Bar dataKey="prog" stackId="a" fill="#f59e0b" radius={[8,8,0,0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-6">
               {[
                 { label: 'Student', color: 'bg-indigo-500' },
                 { label: 'Gaming', color: 'bg-blue-500' },
                 { label: 'Office/Work', color: 'bg-emerald-500' },
                 { label: 'Programming', color: 'bg-amber-500' },
               ].map(l => (
                 <div key={l.label} className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
                    <span className="text-[10px] font-black uppercase text-slate-400">{l.label}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
