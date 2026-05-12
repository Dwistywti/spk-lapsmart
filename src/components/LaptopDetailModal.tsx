import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cpu, 
  Database, 
  Monitor, 
  Zap, 
  ShieldCheck, 
  Target, 
  Star,
  Trophy,
  Activity,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { RankedLaptop } from '../utils/sawAlgorithm';
import { Weights } from '../pages/Recommender';

interface LaptopDetailModalProps {
  laptop: RankedLaptop | null;
  weights: Weights;
  isOpen: boolean;
  onClose: () => void;
  rank: number;
}

export const LaptopDetailModal: React.FC<LaptopDetailModalProps> = ({ 
  laptop, 
  weights, 
  isOpen, 
  onClose,
  rank
}) => {
  if (!laptop) return null;

  // Calculate contribution breakdown
  const contributions = [
    { 
      label: 'Processor', 
      icon: Cpu, 
      weight: weights.processor, 
      normalized: laptop.normalized.processor,
      contribution: (laptop.normalized.processor * weights.processor),
      color: 'bg-indigo-500'
    },
    { 
      label: 'RAM', 
      icon: Zap, 
      weight: weights.ram, 
      normalized: laptop.normalized.ram,
      contribution: (laptop.normalized.ram * weights.ram),
      color: 'bg-blue-500'
    },
    { 
      label: 'Storage', 
      icon: Database, 
      weight: weights.storage, 
      normalized: laptop.normalized.storage,
      contribution: (laptop.normalized.storage * weights.storage),
      color: 'bg-emerald-500'
    },
    { 
      label: 'Display', 
      icon: Monitor, 
      weight: weights.display, 
      normalized: laptop.normalized.display,
      contribution: (laptop.normalized.display * weights.display),
      color: 'bg-amber-500'
    }
  ].sort((a, b) => b.contribution - a.contribution);

  const getReason = () => {
    const top = contributions[0];
    let reason = `Laptop ini sangat unggul pada sektor ${top.label.toLowerCase()} yang memberikan kontribusi terbesar (${top.contribution.toFixed(1)}%) terhadap skor akhir. `;
    
    if (top.label === 'Processor') {
      reason += `Dengan unit ${laptop.processor}, performa komputasi menjadi kekuatan utama yang sangat mendukung kebutuhan Anda.`;
    } else if (top.label === 'RAM') {
      reason += `Kapasitas memori ${laptop.ram}GB memungkinkan multitasking yang sangat lancar sesuai prioritas Anda.`;
    } else if (top.label === 'Storage') {
      reason += `Kecepatan dan kapasitas penyimpanan ${laptop.storage}GB menjadi faktor krusial yang dipenuhi dengan baik oleh perangkat ini.`;
    } else {
      reason += `Kualitas visual pada panel ${laptop.display}" memberikan pengalaman imersif yang optimal.`;
    }

    return reason;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl pointer-events-auto"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-5xl bg-white rounded-[3.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row pointer-events-auto h-full max-h-[90vh]"
          >
            {/* Left Column: Image & Basic Info */}
            <div className="md:w-2/5 relative bg-slate-900 overflow-hidden min-h-[300px] md:min-h-0">
               <img 
                 src={laptop.image} 
                 alt={laptop.model} 
                 className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
               
               <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Rank #{rank}</span>
                     <div className="flex items-center gap-1 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-black">{laptop.rating}</span>
                     </div>
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter leading-tight mb-2">{laptop.model}</h2>
                  <p className="text-indigo-300 font-bold uppercase tracking-[4px] text-xs">{laptop.brand}</p>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Market Price</div>
                     <div className="text-2xl font-black text-white">Rp {(laptop.price/1000000).toFixed(1)}jt</div>
                  </div>
               </div>

               <button 
                onClick={onClose}
                className="absolute top-8 right-8 h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all z-20 md:hidden"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Right Column: Detailed analysis */}
            <div className="flex-1 flex flex-col h-full bg-slate-50">
               {/* Modal Header (Desktop Only) */}
               <div className="hidden md:flex items-center justify-between p-8 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Activity size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Full System Analysis</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated via Simple Additive Weighting</p>
                     </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white ring-1 ring-slate-100 transition-all"
                  >
                    <X size={24} />
                  </button>
               </div>

               {/* Scrolling Body */}
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="grid grid-cols-1 gap-8">
                     
                     {/* Recommendation Reason */}
                     <section className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                           <Sparkles size={18} />
                           <h4 className="text-[10px] font-black uppercase tracking-[3px]">Why Recommended?</h4>
                        </div>
                        <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-6 opacity-5"><Target size={80} /></div>
                           <p className="text-lg font-medium text-slate-700 italic relative z-10">"{getReason()}"</p>
                        </div>
                     </section>

                     {/* SAW contribution */}
                     <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-emerald-600">
                              <ShieldCheck size={18} />
                              <h4 className="text-[10px] font-black uppercase tracking-[3px]">Weight Contribution Analysis</h4>
                           </div>
                           <div className="px-4 py-1.5 bg-slate-900 rounded-xl">
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Final Score: {laptop.score.toFixed(2)}</span>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {contributions.map((c) => (
                             <div key={c.label} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                      <div className={`h-10 w-10 rounded-xl ${c.color} flex items-center justify-center text-white shadow-lg`}>
                                         <c.icon size={20} />
                                      </div>
                                      <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{c.label}</span>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Norm (R)</p>
                                      <p className="text-sm font-black text-slate-900">{c.normalized.toFixed(3)}</p>
                                   </div>
                                </div>
                                
                                <div className="space-y-3">
                                   <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                      <span>Weight Contribution</span>
                                      <span>{c.contribution.toFixed(1)}%</span>
                                   </div>
                                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.contribution * (100/c.weight)}%` }} // Normalized relative to its own weight potential
                                        transition={{ delay: 0.5, duration: 1 }}
                                        className={`h-full ${c.color}`} 
                                      />
                                   </div>
                                   <p className="text-[9px] font-medium text-slate-400 italic">User assigned {c.weight}% weight to this criterion.</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>

                     {/* Full Specs */}
                     <section className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                           <Target size={18} />
                           <h4 className="text-[10px] font-black uppercase tracking-[3px]">Technical Specifications</h4>
                        </div>
                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 divide-y divide-slate-50">
                           {[
                              { label: 'Model Identifer', value: laptop.model, icon: Info },
                              { label: 'Brand', value: laptop.brand, icon: ArrowRight },
                              { label: 'System Processor', value: laptop.processor, icon: Cpu },
                              { label: 'Compute Unit', value: `${laptop.coreNum || '-'} Cores / ${laptop.threadsNum || '-'} Threads`, icon: Activity },
                              { label: 'Memory (RAM)', value: `${laptop.ram} GB DDR`, icon: Zap },
                              { label: 'Primary Storage', value: laptop.storage >= 1000 ? `${(laptop.storage/1000).toFixed(0)} TB` : `${laptop.storage} GB SSD`, icon: Database },
                              { label: 'Display Panel', value: `${laptop.display}" Screen Size`, icon: Monitor },
                              { label: 'Performance Index', value: `${laptop.processorScore} / 10.0`, icon: ShieldCheck },
                           ].map((item, i) => (
                             <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                   <item.icon size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                                </div>
                                <span className="text-sm font-bold text-slate-900">{item.value}</span>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
               </div>

               {/* Footer Analysis */}
               <div className="p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                     <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl text-indigo-400 italic">
                        #{rank}
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">DSS Position</p>
                        <p className="text-sm font-bold text-slate-300">Top recommendation for current criteria.</p>
                     </div>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[4px] opacity-30 text-center sm:text-right">
                     Decision Engine v2.1.4 <br /> Authorized Profile Analysis
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
