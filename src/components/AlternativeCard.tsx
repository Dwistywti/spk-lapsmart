import React from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, Zap, Target } from 'lucide-react';
import { RankedLaptop } from '../utils/sawAlgorithm';

interface AlternativeCardProps {
  laptop: RankedLaptop;
  rank: number;
  onClick: () => void;
}

export const AlternativeCard: React.FC<AlternativeCardProps> = ({ laptop, rank, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="bg-white p-8 rounded-[2.5rem] ring-1 ring-slate-100 shadow-sm transition-all group-hover:ring-indigo-600 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Rank Badge */}
        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-50 flex flex-col items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
           <span className="text-[9px] font-black uppercase opacity-50">Rank</span>
           <span className="text-xl font-black italic">#{rank}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left">
           <div className="flex items-center justify-center sm:justify-between mb-2">
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[3px]">{laptop.brand}</p>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg text-amber-600 border border-amber-100">
                 <Star size={10} fill="currentColor" />
                 <span className="text-[10px] font-black">{laptop.rating}</span>
              </div>
           </div>

           <h4 className="text-xl font-black text-slate-900 truncate mb-1 leading-tight group-hover:text-indigo-600 transition-colors">{laptop.model}</h4>
           
           <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{laptop.processor}</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{laptop.ram}GB RAM</span>
           </div>

           <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Preference</p>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">Score: {laptop.score.toFixed(1)}</span>
              </div>
              <div className="text-right">
                 <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Price</p>
                 <span className="text-xs font-black text-slate-600">Rp {(laptop.price/1000000).toFixed(1)}jt</span>
              </div>
           </div>
        </div>

        {/* Floating Action Button - only visible on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 hidden sm:block">
           <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
              <ChevronRight size={20} />
           </div>
        </div>
      </div>
      
      {/* View Detail label for mobile */}
      <div className="mt-2 text-center sm:hidden">
         <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Tap to view full analysis</span>
      </div>
    </motion.div>
  );
};
