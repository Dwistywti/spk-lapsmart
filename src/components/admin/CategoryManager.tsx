import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  Trash2, 
  Plus, 
  Check, 
  ChevronRight,
  Target
} from 'lucide-react';
import { CategoryWeights } from '../../types';

interface CategoryManagerProps {
  weights: CategoryWeights;
  onUpdate: (updated: CategoryWeights) => void;
}

export const CategoryManager = ({ weights, onUpdate }: CategoryManagerProps) => {
  const [selectedCat, setSelectedCat] = useState<string | null>(Object.keys(weights)[0]);

  const handleWeightChange = (category: string, criterion: string, value: number) => {
    const updated = { ...weights };
    (updated as any)[category][criterion] = Math.min(100, Math.max(0, value)) / 100;
    onUpdate(updated);
  };

  const total = (cat: string) => {
    const w = (weights as any)[cat];
    const sum = Object.values(w).reduce((a: any, b: any) => a + b, 0) as number;
    return Math.round(sum * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
      {/* Sidebar List */}
      <div className="lg:col-span-4 space-y-4">
         <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-lg font-black text-slate-900">Preset Kebutuhan</h3>
            <button className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
               <Plus size={16} />
            </button>
         </div>
         <div className="space-y-2">
            {Object.keys(weights).map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${selectedCat === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                   <div className={`h-2 w-2 rounded-full ${total(cat) === 100 ? 'bg-emerald-400 shadow-sm' : 'bg-amber-400 shadow-sm animate-pulse'}`} />
                   <span className="text-sm font-black uppercase tracking-tight">{cat}</span>
                </div>
                <ChevronRight size={16} className={selectedCat === cat ? 'opacity-100' : 'opacity-20'} />
              </button>
            ))}
         </div>
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-8">
         <AnimatePresence mode="wait">
            {selectedCat && (
              <motion.div 
                key={selectedCat}
                initial={{ opacity:0, x:20 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-20 }}
                className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
              >
                 <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Settings2 size={24} />
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-slate-900">{selectedCat} Profile</h2>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weight Contribution Editor</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                       <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${total(selectedCat) === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {total(selectedCat) === 100 ? <Check size={12} /> : <Target size={12} />}
                          Sum: {total(selectedCat).toFixed(0)}%
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {Object.entries((weights as any)[selectedCat]).map(([k, v]: [string, any]) => (
                      <div key={k} className="space-y-4">
                         <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">{k}</label>
                            <span className="text-xl font-black text-indigo-600">{(v * 100).toFixed(0)}%</span>
                         </div>
                         <div className="flex items-center gap-4">
                           <input 
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={v * 100}
                              onChange={(e) => handleWeightChange(selectedCat, k, parseInt(e.target.value))}
                              className="flex-1 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                           />
                           <input 
                              type="number"
                              value={v * 100}
                              onChange={(e) => handleWeightChange(selectedCat, k, parseInt(e.target.value))}
                              className="w-16 bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-sm font-black text-center"
                           />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                       <Trash2 size={14} /> Delete Profile
                    </button>
                    <div className="flex gap-4">
                       <button className="px-8 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Revert Changes</button>
                       <button 
                         disabled={total(selectedCat) !== 100}
                         className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${total(selectedCat) === 100 ? 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}
                       >
                          Update Profile
                       </button>
                    </div>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};
