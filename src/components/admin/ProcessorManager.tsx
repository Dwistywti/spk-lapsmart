import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Cpu, 
  Settings2, 
  Zap,
  TrendingDown,
  Activity
} from 'lucide-react';
import { Laptop } from '../../types';

interface ProcessorManagerProps {
  laptops: Laptop[];
}

export const ProcessorManager = ({ laptops }: ProcessorManagerProps) => {
  const procData = useMemo(() => {
    // Top 10 High-Performing Processors
    return laptops
      .map(l => ({ name: l.processor, score: l.processorScore, model: l.model }))
      .sort((a,b) => b.score - a.score)
      .slice(0, 10);
  }, [laptops]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Info */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10">
         <div className="h-24 w-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-3xl shadow-indigo-500/20">
            <Cpu size={48} />
         </div>
         <div className="flex-1">
            <h2 className="text-3xl font-black tracking-tighter">Computation Engine Settings</h2>
            <p className="text-slate-400 font-medium mt-2 max-w-xl">
               Manajemen skor performa unit pemrosesan. Sistem menggunakan formula linier untuk menentukan <span className="text-white">Processor Index</span> yang digunakan dalam normalisasi SAW.
            </p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Algorithm Formula</p>
            <code className="text-sm font-mono font-black">(C*0.6) + (T*0.4)</code>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Top Processor Chart */}
         <div className="lg:col-span-7 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Performance Leaderboard</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Raw Scoring CPUs in DB</p>
               </div>
               <Activity size={20} className="text-slate-200" />
            </div>
            
            <div className="flex-1 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={procData} layout="vertical" margin={{ left: 50 }}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                     <XAxis type="number" hide />
                     <YAxis 
                       dataKey="name" 
                       type="category" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                       width={100}
                     />
                     <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     />
                     <Bar dataKey="score" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Settings & Stats */}
         <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <Settings2 size={24} className="text-indigo-600" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Coefficient Tuning</h4>
               </div>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Core Weight</span>
                        <span className="text-sm font-black text-indigo-600">0.6</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.1" defaultValue="0.6" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-indigo-600" disabled />
                  </div>
                  <div>
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Thread Weight</span>
                        <span className="text-sm font-black text-indigo-600">0.4</span>
                     </div>
                     <input type="range" min="0" max="1" step="0.1" defaultValue="0.4" className="w-full h-1.5 bg-slate-100 rounded-full appearance-none accent-indigo-600" disabled />
                  </div>
               </div>
               <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <Zap className="text-amber-500 mt-0.5" size={16} />
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed italic">Aturan pembobotan ini bersifat global dan berdampak pada seluruh database. Penyesuaian memerlukan sinkronisasi ulang datasets.</p>
               </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 font-mono">Statistical Insights</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                     <p className="text-[10px] font-black uppercase text-slate-400">Avg Threads</p>
                     <p className="text-lg font-black text-slate-900">12.4</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                     <p className="text-[10px] font-black uppercase text-slate-400">Peak Score</p>
                     <p className="text-lg font-black text-emerald-500">96.8</p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                     <p className="text-[10px] font-black uppercase text-slate-400">Min Score</p>
                     <p className="text-lg font-black text-red-400">12.0</p>
                  </div>
               </div>
               <button className="w-full mt-6 py-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[2px] transition-all flex items-center justify-center gap-2">
                  Analyze Distribution <TrendingDown size={14} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
