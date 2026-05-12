import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Tag, 
  Trash2, 
  Search, 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Package
} from 'lucide-react';
import { Laptop } from '../../types';

interface BrandManagerProps {
  laptops: Laptop[];
}

export const BrandManager = ({ laptops }: BrandManagerProps) => {
  const brandStats = useMemo(() => {
    const stats: Record<string, { count: number, avgPrice: number, avgRating: number }> = {};
    laptops.forEach(l => {
      if (!stats[l.brand]) stats[l.brand] = { count: 0, avgPrice: 0, avgRating: 0 };
      stats[l.brand].count++;
      stats[l.brand].avgPrice += l.price;
      stats[l.brand].avgRating += (l.rating || 0);
    });
    
    return Object.entries(stats).map(([name, data]) => ({
      name,
      count: data.count,
      avgPrice: data.avgPrice / data.count,
      avgRating: data.avgRating / data.count
    })).sort((a, b) => b.count - a.count);
  }, [laptops]);

  const invalidBrands = useMemo(() => {
    return brandStats.filter(b => b.name.length < 2 || /[^a-zA-Z0-9\s]/.test(b.name));
  }, [brandStats]);

  return (
    <div className="space-y-8 pb-10">
      {/* Brand Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {brandStats.slice(0, 4).map((b, i) => (
           <div key={b.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                 <Tag size={100} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{b.name}</span>
                    <TrendingUp size={14} className="text-emerald-400" />
                 </div>
                 <h4 className="text-2xl font-black text-slate-900">{b.count} <span className="text-xs font-bold text-slate-300">Models</span></h4>
                 <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-slate-400">
                    <span>Avg Price</span>
                    <span className="text-slate-900">Rp {(b.avgPrice/1000000).toFixed(1)}jt</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Brand Table */}
         <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-lg font-black text-slate-900">Normalization & Consistency</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input placeholder="Search brand..." className="pl-9 pr-4 py-2 bg-slate-50 border-0 rounded-xl text-xs font-bold w-48" />
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Provider</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Catalog</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Rating</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {brandStats.map(b => (
                       <tr key={b.name} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-8 py-5 font-black text-slate-900 capitalize italic">{b.name}</td>
                          <td className="px-8 py-5 font-bold text-slate-500">{b.count} Items</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-indigo-400" />
                                <span className="font-mono text-xs font-bold text-slate-600">{b.avgRating.toFixed(1)}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-md uppercase border border-emerald-100">Consistent</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Issue Panel */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
               <div className="flex items-center gap-3 mb-8">
                  <AlertCircle className="text-amber-400" size={24} />
                  <h3 className="text-lg font-black">Data Hygiene</h3>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 font-mono">Invalid or Weak Identifiers Detected</p>
               
               <div className="space-y-4">
                  {invalidBrands.length > 0 ? invalidBrands.map(b => (
                    <div key={b.name} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between group">
                       <div>
                          <p className="text-xs font-black text-amber-400">{b.name || 'EMPTY NAME'}</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Failed Regex Validation</p>
                       </div>
                       <button className="h-8 w-8 rounded-lg bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white">
                          <Trash2 size={14} />
                       </button>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-slate-500 italic text-xs font-medium">
                       No brand normalization issues detected. <br /> Database is healthy.
                    </div>
                  )}
               </div>

               <button className="w-full mt-8 py-4 bg-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-indigo-900/50">
                  Auto-Run Normalization
               </button>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
               <Package className="text-slate-100 mb-4" size={40} />
               <h4 className="text-sm font-black text-slate-900 mb-2">Duplicate Detection</h4>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Sistem mendeteksi kemiripan brand (misal: "ASUS" & "Asus"). Gunakan tool merge untuk menyatukan data.</p>
               <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 hover:translate-x-1 transition-transform">Scan for Duplicates <Trash2 size={12} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};
