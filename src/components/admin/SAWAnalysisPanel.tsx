import { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Target, 
  Activity, 
  HelpCircle,
  Table as TableIcon,
  Divide,
  Plus as PlusIcon,
  Equal
} from 'lucide-react';
import { Laptop } from '../../types';
import { calculateSAW } from '../../utils/sawAlgorithm';

interface SAWAnalysisPanelProps {
  laptops: Laptop[];
}

export const SAWAnalysisPanel = ({ laptops }: SAWAnalysisPanelProps) => {
  const dummyWeights = { ram: 0.25, storage: 0.25, processor: 0.25, display: 0.25 };
  
  const sampleData = useMemo(() => {
    return calculateSAW(laptops, dummyWeights);
  }, [laptops]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">SAW Analysis</h2>
          <p className="text-sm text-slate-500 font-medium italic">
            Transparansi perhitungan metode Simple Additive Weighting (SAW).
          </p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <Activity size={16} className="text-indigo-600" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status: Validated</span>
        </div>
      </div>

      {/* Recommended Spotlight */}
      {sampleData[0] && (
        <section className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
           <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <Target size={240} />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md mb-6 border border-white/20">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[2px]">Rekomendasi Utama (Rank #1)</span>
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter mb-4 leading-tight uppercase">
                    {sampleData[0].brand} <br />
                    <span className="text-indigo-200">{sampleData[0].model}</span>
                 </h3>
                 <p className="text-indigo-100 font-medium text-sm mb-8 leading-relaxed max-w-md">
                    Laptop ini memiliki nilai preferensi (Vi) tertinggi sebesar <span className="font-black text-white">{sampleData[0].score.toFixed(2)}</span> berdasarkan normalisasi kriteria Benefit (RAM, Storage, Processor, Display).
                 </p>
                 <div className="grid grid-cols-4 gap-4">
                    {[
                      { l: 'RAM', v: sampleData[0].normalized.ram },
                      { l: 'STOR', v: sampleData[0].normalized.storage },
                      { l: 'PROC', v: sampleData[0].normalized.processor },
                      { l: 'DISP', v: sampleData[0].normalized.display }
                    ].map(stat => (
                      <div key={stat.l} className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                         <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">{stat.l}</p>
                         <p className="text-sm font-black text-white">{stat.v.toFixed(2)}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="hidden lg:flex justify-center">
                 <div className="h-64 w-96 bg-white/20 rounded-[2.5rem] backdrop-blur-2xl border border-white/30 p-8 shadow-inner overflow-hidden">
                    <img src={sampleData[0].image} alt="" className="w-full h-full object-contain filter drop-shadow-2xl" />
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Logic & Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 h-full">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Divide size={20} />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Normalisasi (R)</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-0.5">Benefit Criterion Transformation</p>
                </div>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Setiap nilai kriteria dibagi dengan nilai maksimum dari kriteria tersebut dalam seluruh alternatif untuk mendapatkan skala 0-1.
             </p>
             <div className="p-5 bg-slate-900 rounded-3xl">
                <code className="text-xs font-mono font-black text-indigo-300 tracking-wider">rij = xij / max(xij)</code>
             </div>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 h-full">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <PlusIcon size={20} />
                </div>
                <div>
                   <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Preferensi (V)</h4>
                   <p className="text-[10px] font-bold text-slate-400 mt-0.5">Weighted Aggregation Method</p>
                </div>
             </div>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Hasil normalisasi dikalikan dengan bobot kriteria, kemudian seluruh nilainya dijumlahkan untuk mendapatkan skor akhir.
             </p>
             <div className="p-5 bg-slate-900 rounded-3xl">
                <code className="text-xs font-mono font-black text-emerald-300 tracking-wider">Vi = Σ (wj * rij)</code>
             </div>
          </div>
        </div>
      </div>

      {/* Decision Matrix Table */}
      <section className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <TableIcon size={20} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Matriks Perhitungan Lengkap</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Bobot Reference: 0.25 Fixed</p>
               </div>
            </div>
            <div className="px-6 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{sampleData.length} Laptops Ranked</span>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-sm">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                     <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Alternatif</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">RAM (R1)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">STOR (R2)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">PROC (R3)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">DISP (R4)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50/50">Skor Akhir (Vi)</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Rank</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {sampleData.map((result, i) => (
                       <tr key={result.id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-8 py-6">
                             <div className="flex flex-col">
                                <span className="font-black text-slate-900 leading-tight uppercase text-xs">{result.brand}</span>
                                <span className="text-[10px] font-medium text-slate-400 mt-1 truncate max-w-[150px]">{result.model}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 font-mono text-[10px] text-slate-500 font-bold">{result.normalized.ram.toFixed(3)}</td>
                          <td className="px-8 py-6 font-mono text-[10px] text-slate-500 font-bold">{result.normalized.storage.toFixed(3)}</td>
                          <td className="px-8 py-6 font-mono text-[10px] text-slate-500 font-bold">{result.normalized.processor.toFixed(3)}</td>
                          <td className="px-8 py-6 font-mono text-[10px] text-slate-500 font-bold">{result.normalized.display.toFixed(3)}</td>
                          <td className="px-8 py-6 bg-indigo-50/10">
                             <span className="font-black text-indigo-600 text-sm">
                                {result.score.toFixed(4)}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex justify-center">
                                <span className={`h-8 w-8 flex items-center justify-center rounded-xl font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
                                   {i + 1}
                                </span>
                             </div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>
    </div>
  );
};
