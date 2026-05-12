import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Database,
  Search,
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react';
import { Laptop } from '../../types';

interface DatasetQualityProps {
  laptops: Laptop[];
}

export const DatasetQuality = ({ laptops }: DatasetQualityProps) => {
  const issues = useMemo(() => {
    const list: string[] = [];
    laptops.forEach((l, idx) => {
      if (!l.processor) list.push(`Row ${idx+1}: Missing Processor name`);
      if (l.price <= 0) list.push(`Row ${idx+1}: Invalid Price (0 or less)`);
      if (l.ram <= 0) list.push(`Row ${idx+1}: Invalid RAM capacity`);
      if (!l.image) list.push(`Row ${idx+1}: Missing Product image`);
      if (l.model.length < 3) list.push(`Row ${idx+1}: Model name too short`);
    });
    return list;
  }, [laptops]);

  const healthScore = useMemo(() => {
    const totalPotentialIssues = laptops.length * 5; // 5 checks per row
    const actualIssues = issues.length;
    return Math.max(0, 100 - (actualIssues / totalPotentialIssues * 100));
  }, [laptops, issues]);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Health Overview */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative border-t-8 border-indigo-600">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={120} /></div>
               <h3 className="text-xl font-black mb-1">Dataset Health</h3>
               <p className="text-[10px] font-black uppercase tracking-[3px] text-indigo-400 mb-10">Real-Time Validation Audit</p>
               
               <div className="relative h-48 w-48 mx-auto mb-10">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                     <motion.circle 
                       cx="96" cy="96" r="80" 
                       stroke="currentColor" strokeWidth="12" fill="transparent" 
                       strokeDasharray={2 * Math.PI * 80}
                       initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                       animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - healthScore/100) }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="text-indigo-500" 
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-4xl font-black">{healthScore.toFixed(0)}%</span>
                     <span className="text-[10px] font-black uppercase text-indigo-400">Score</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-lg font-black">{laptops.length}</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Scanned</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className={`text-lg font-black ${issues.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{issues.length}</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Alerts</p>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck size={20} className="text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-900">Auto-Fix Engine</h4>
               </div>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Sistem dapat melakukan perbaikan otomatis pada field yang kosong dengan algoritma estimasi atau data default.</p>
               <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-600 hover:text-white transition-all cursor-not-allowed">Run repair tool (Disabled)</button>
            </div>
         </div>

         {/* Detailed Logs */}
         <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Validation Logs</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Found {issues.length} Structural Warnings</p>
               </div>
               <div className="flex gap-2">
                  <button className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all"><Search size={16} /></button>
                  <button className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-100">Export Log</button>
               </div>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto max-h-[600px] custom-scrollbar space-y-4">
               {issues.map((issue, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 group hover:border-amber-200 hover:bg-amber-50/20 transition-all">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-amber-500">
                       <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-700">{issue}</p>
                       <div className="mt-2 flex items-center gap-4">
                          <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:underline">Focus Entity</button>
                          <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">Dismiss</button>
                       </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-300 group-hover:text-amber-300">#WARN_{i+100}</div>
                 </div>
               ))}

               {issues.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center py-20">
                    <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
                       <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Dataset Berhasil Divalidasi</h3>
                    <p className="text-sm font-medium text-slate-400 mt-2">Seluruh data mematuhi skema SAW v2.1</p>
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
