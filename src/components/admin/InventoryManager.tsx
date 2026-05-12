import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Laptop as LaptopIcon, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Database,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { Laptop } from '../../types';

interface InventoryManagerProps {
  laptops: Laptop[];
  onAdd: (laptop: Partial<Laptop>) => void;
  onEdit: (laptop: Laptop) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}

export const InventoryManager = ({ laptops, onAdd, onEdit, onDelete, onReset }: InventoryManagerProps) => {
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState<Laptop | null>(null);
  const [filterBrand, setFilterBrand] = useState("All");

  const [formData, setFormData] = useState<Partial<Laptop>>({
    brand: "",
    model: "",
    price: undefined,
    ram: undefined,
    storage: undefined,
    processorScore: undefined,
    display: undefined,
    rating: undefined,
    description: "",
    image: "",
    processor: "",
    coreNum: undefined,
    threadsNum: undefined
  });

  const brands = ["All", ...new Set(laptops.map(l => l.brand))].sort();

  const filtered = laptops.filter(l => {
    const matchesSearch = l.brand.toLowerCase().includes(search.toLowerCase()) || 
                          l.model.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = filterBrand === "All" || l.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const handleEditClick = (laptop: Laptop) => {
    setEditingLaptop(laptop);
    setFormData(laptop);
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setEditingLaptop(null);
    setFormData({
      brand: "",
      model: "",
      price: undefined,
      ram: undefined,
      storage: undefined,
      processorScore: undefined,
      display: undefined,
      rating: undefined,
      description: "",
      image: "",
      processor: "",
      coreNum: undefined,
      threadsNum: undefined
    });
  };

  const handleSubmit = () => {
    if (editingLaptop) {
      onEdit({ ...editingLaptop, ...formData } as Laptop);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text"
              placeholder="Search by brand or model name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
            />
         </div>
         <div className="flex gap-3">
            <div className="relative group">
               <select 
                 value={filterBrand}
                 onChange={(e) => setFilterBrand(e.target.value)}
                 className="appearance-none bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-10 text-xs font-black uppercase tracking-widest text-slate-500 focus:ring-2 focus:ring-indigo-600 cursor-pointer"
               >
                 {brands.map(b => <option key={b} value={b}>{b}</option>)}
               </select>
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
            </div>
            <button 
              onClick={onReset}
              className="h-14 px-6 rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-all"
              title="Sync with Excel Dataset"
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={() => setIsAdding(true)}
              className="h-14 px-8 rounded-2xl bg-indigo-600 text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-indigo-500/20"
            >
              <Plus size={18} />
              Add Laptop
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Device Identity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Price</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Specs</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">System Index</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Management</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filtered.map((laptop) => (
                    <tr key={laptop.id} className="group hover:bg-slate-50/80 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden ring-1 ring-slate-200 group-hover:ring-indigo-200 transition-all">
                                {laptop.image ? <img src={laptop.image} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><LaptopIcon size={24} /></div>}
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">{laptop.brand}</p>
                                <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{laptop.model}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="font-mono text-sm font-bold text-slate-600">Rp {(laptop.price/1000000).toFixed(1)}jt</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-lg text-slate-500">{laptop.ram}GB RAM</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-lg text-slate-500">{laptop.storage >= 1000 ? `${(laptop.storage/1000).toFixed(0)}TB` : `${laptop.storage}GB`} SSD</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{laptop.processor}</p>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xs shadow-lg transform group-hover:scale-110 transition-transform">
                             {laptop.processorScore.toFixed(0)}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                             <button 
                               onClick={() => handleEditClick(laptop)}
                               className="h-10 w-10 flex items-center justify-center rounded-xl bg-white ring-1 ring-slate-100 text-slate-400 hover:text-indigo-600 hover:ring-indigo-600 shadow-sm transition-all"
                             >
                                <Edit3 size={16} />
                             </button>
                             <button 
                               onClick={() => onDelete(laptop.id)}
                               className="h-10 w-10 flex items-center justify-center rounded-xl bg-white ring-1 ring-slate-100 text-slate-400 hover:text-red-500 hover:ring-red-500 shadow-sm transition-all"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <div className="flex flex-col items-center">
                            <Database className="text-slate-100 h-20 w-20 mb-4" />
                            <p className="text-slate-400 font-black uppercase tracking-widest">No entries found matching criteria</p>
                         </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
         {(isAdding || editingLaptop) && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                onClick={handleCloseModal}
              />
              <motion.div 
                initial={{ opacity:0, scale:0.95, y:20 }}
                animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0, scale:0.95, y:20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                  <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{editingLaptop ? 'Edit Data Laptop' : 'Tambah Laptop Baru'}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pengelolaan Data Alternatif SPK</p>
                     </div>
                     <button onClick={handleCloseModal} className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all ring-1 ring-slate-100 shadow-sm"><X size={20} /></button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                     <div className="space-y-12">
                        {/* SECTION A: INFORMASI DASAR */}
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-1 bg-indigo-600 rounded-full" />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">A. Informasi Dasar</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand</label>
                                 <input 
                                   placeholder="Contoh: ASUS, Apple, Lenovo" 
                                   value={formData.brand}
                                   onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all font-sans" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Harga (Rupiah)</label>
                                 <input 
                                   placeholder="Contoh: 15000000" 
                                   type="number"
                                   value={formData.price || ""}
                                   onChange={(e) => setFormData({...formData, price: e.target.value ? Number(e.target.value) : undefined})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all font-mono" 
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Laptop / Model</label>
                                 <input 
                                   placeholder="Contoh: ROG Zephyrus G14GA402" 
                                   value={formData.model}
                                   onChange={(e) => setFormData({...formData, model: e.target.value})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                              </div>
                           </div>
                        </div>

                        {/* SECTION B: SPESIFIKASI LAPTOP */}
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-1 bg-indigo-600 rounded-full" />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">B. Spesifikasi Laptop</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Processor</label>
                                 <input 
                                   placeholder="Contoh: Intel Core i7-1255U" 
                                   value={formData.processor}
                                   onChange={(e) => setFormData({...formData, processor: e.target.value})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                                 <p className="text-[9px] text-slate-400 font-medium ml-1">Nama teknis prosesor.</p>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Core</label>
                                 <input 
                                   type="number"
                                   placeholder="Contoh: 10" 
                                   value={formData.coreNum || ""}
                                   onChange={(e) => {
                                      const val = e.target.value ? Number(e.target.value) : undefined;
                                      const score = val !== undefined && formData.threadsNum !== undefined 
                                         ? (val * 0.6 + formData.threadsNum * 0.4) 
                                         : (formData.processorScore || 0);
                                      setFormData({...formData, coreNum: val, processorScore: score});
                                   }}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                                 <p className="text-[9px] text-slate-400 font-medium ml-1">Masukkan jumlah core prosesor.</p>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Thread</label>
                                 <input 
                                   type="number"
                                   placeholder="Contoh: 12" 
                                   value={formData.threadsNum || ""}
                                   onChange={(e) => {
                                      const val = e.target.value ? Number(e.target.value) : undefined;
                                      const score = val !== undefined && formData.coreNum !== undefined 
                                         ? (formData.coreNum * 0.6 + val * 0.4) 
                                         : (formData.processorScore || 0);
                                      setFormData({...formData, threadsNum: val, processorScore: score});
                                   }}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                                 <p className="text-[9px] text-slate-400 font-medium ml-1">Masukkan jumlah thread prosesor.</p>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">RAM (GB)</label>
                                 <input 
                                   type="number"
                                   placeholder="Contoh: 16" 
                                   value={formData.ram || ""}
                                   onChange={(e) => setFormData({...formData, ram: e.target.value ? Number(e.target.value) : undefined})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Storage (GB)</label>
                                 <input 
                                   type="number"
                                   placeholder="Contoh: 512" 
                                   value={formData.storage || ""}
                                   onChange={(e) => setFormData({...formData, storage: e.target.value ? Number(e.target.value) : undefined})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Layar (Inci)</label>
                                 <input 
                                   type="number"
                                   step="0.1"
                                   placeholder="Contoh: 14" 
                                   value={formData.display || ""}
                                   onChange={(e) => setFormData({...formData, display: e.target.value ? Number(e.target.value) : undefined})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                              </div>
                           </div>
                           {formData.processorScore !== undefined && (formData.coreNum !== undefined || formData.threadsNum !== undefined) && (
                              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Processor Score Terhitung (Otomatis)</p>
                                 <span className="text-xl font-black text-indigo-600">{formData.processorScore.toFixed(1)}</span>
                              </div>
                           )}
                        </div>

                        {/* SECTION C: INFORMASI TAMBAHAN */}
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-1 bg-indigo-600 rounded-full" />
                              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">C. Informasi Tambahan</h3>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rating (0-5)</label>
                                 <input 
                                   type="number"
                                   step="0.1"
                                   placeholder="Contoh: 4.5" 
                                   value={formData.rating || ""}
                                   onChange={(e) => setFormData({...formData, rating: e.target.value ? Number(e.target.value) : undefined})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all font-sans" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL Gambar</label>
                                 <input 
                                   placeholder="Tempel link foto di sini..." 
                                   value={formData.image}
                                   onChange={(e) => setFormData({...formData, image: e.target.value})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-xs font-mono focus:ring-2 focus:ring-indigo-600 transition-all" 
                                 />
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Deskripsi Singkat</label>
                                 <textarea 
                                   placeholder="Tuliskan ringkasan fitur atau keunggulan laptop ini..." 
                                   value={formData.description}
                                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                                   className="w-full bg-slate-50 border-0 rounded-2xl py-4 px-6 text-sm font-medium h-32 focus:ring-2 focus:ring-indigo-600 transition-all custom-scrollbar outline-none" 
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                     <button onClick={handleCloseModal} className="flex-1 py-5 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Batal</button>
                     <button 
                       onClick={handleSubmit}
                       className="flex-[2] py-5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                     >
                        {editingLaptop ? 'Simpan Perubahan' : 'Tambah Laptop'}
                     </button>
                  </div>

              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
