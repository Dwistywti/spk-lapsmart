import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { Laptop, CATEGORY_WEIGHTS, Weights } from '../../types';
import { 
  TrendingUp, 
  Package, 
  Star,
  Award,
  ChevronRight,
  Activity
} from 'lucide-react';
import { calculateSAW } from '../../utils/sawAlgorithm';

interface DashboardOverviewProps {
  laptops: Laptop[];
  weights: Weights;
}

export const DashboardOverview = ({ laptops, weights }: DashboardOverviewProps) => {
  const stats = useMemo(() => {
    if (laptops.length === 0) return null;
    
    const avgPrice = laptops.reduce((a, b) => a + b.price, 0) / laptops.length;
    const avgRating = laptops.reduce((a, b) => a + (b.rating || 0), 0) / laptops.length;
    
    // Calculate best recommendation using provided weights
    const sawResults = calculateSAW(laptops, weights);
    const bestPick = sawResults.length > 0 ? sawResults[0] : null;

    return { avgPrice, avgRating, bestPick, topScores: sawResults.slice(0, 5) };
  }, [laptops, weights]);

  if (!stats) return null;

  return (
    <div className="space-y-8 pb-10">
      {/* Essential Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Laptop', value: laptops.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Average Price', value: `Rp ${(stats.avgPrice/1000000).toFixed(1)}jt`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Average Rating', value: `${stats.avgRating.toFixed(1)}/5.0`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Best SAW Score', value: stats.bestPick ? stats.bestPick.score.toFixed(2) : '0.00', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <motion.div 
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.1 }}
            key={s.label} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`h-14 w-14 rounded-2xl ${s.bg} flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
               <p className="text-xl font-black text-slate-900">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Best Recommendation Highlight */}
         <div className="lg:col-span-5 bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Award size={180} /></div>
            <div className="relative z-10 h-full flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[3px] text-indigo-400 mb-2">Best Recommendation</span>
               <h3 className="text-3xl font-black mb-6 tracking-tight">Top Alternative Pick</h3>
               
               {stats.bestPick ? (
                 <div className="flex-1 flex flex-col justify-between">
                    <div>
                       <div className="h-20 w-32 rounded-2xl overflow-hidden bg-white/10 mb-6 border border-white/10">
                          <img src={stats.bestPick.image} alt="" className="h-full w-full object-cover" />
                       </div>
                       <h4 className="text-2xl font-black text-white">{stats.bestPick.brand}</h4>
                       <p className="text-lg font-bold text-slate-400">{stats.bestPick.model}</p>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-8">
                       <div>
                          <p className="text-[10px] font-black uppercase text-indigo-400">SAW Score</p>
                          <p className="text-3xl font-black text-white">{stats.bestPick.score.toFixed(3)}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-indigo-400">Rank</p>
                          <p className="text-3xl font-black text-white">#1</p>
                       </div>
                    </div>
                 </div>
               ) : (
                 <p className="text-slate-400 font-medium italic">No data available yet...</p>
               )}
            </div>
         </div>

         {/* SAW Score Overview Chart */}
         <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">SAW Score Overview</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Top Ranked Alternatives</p>
               </div>
               <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <Activity size={20} />
               </div>
            </div>

            <div className="h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topScores.map(s => ({ name: s.model.substring(0, 10), score: parseFloat(s.score.toFixed(2)) }))}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                     <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                     />
                     <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <p className="text-xs font-bold text-slate-400">Ranking changes based on active weight configuration.</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1 italic">Note: Higher SAW score indicates a better compatibility match.</p>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Dynamic Ranking <Activity size={14} />
               </div>
            </div>
         </div>
      </div>

      {/* Ranking Details Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Ranking Details breakdown</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Detailed scores for top alternatives</p>
            </div>
         </div>

         <div className="overflow-x-auto -mx-10 px-10">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Alternative</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">RAM Score</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Storage Score</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">CPU Score</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Display Score</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 text-right">Final Vi</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats.topScores.map((item, i) => (
                    <tr key={item.id} className="group hover:bg-slate-50 transition-all">
                       <td className="py-5 pr-4">
                          <div className="flex items-center gap-4">
                             <div className={`h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-[10px] ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                {i + 1}
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-900 uppercase leading-none">{item.brand}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{item.model.substring(0, 20)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{item.normalized.ram.toFixed(3)}</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{item.normalized.storage.toFixed(3)}</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{item.normalized.processor.toFixed(3)}</span>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{item.normalized.display.toFixed(3)}</span>
                       </td>
                       <td className="py-5 pl-4 text-right">
                          <span className="text-sm font-black text-indigo-600">{item.score.toFixed(3)}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
