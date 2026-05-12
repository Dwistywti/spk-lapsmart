import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop as LaptopIcon, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Trophy, 
  Sparkles,
  Info,
  Check,
  LayoutList,
  Target,
  Maximize2,
  X,
  Zap,
  Shield
} from "lucide-react";
import { CATEGORIES, CATEGORY_WEIGHTS, Category, Laptop } from "../types";
import { MOCK_LAPTOPS } from "../data/mockLaptops";
import { calculateSAW, RankedLaptop } from "../utils/sawAlgorithm";
import { explainRecommendation } from "../services/geminiService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { LaptopDetailModal } from "../components/LaptopDetailModal";
import { AlternativeCard } from "../components/AlternativeCard";

type Step = "category" | "weights" | "results";
 
export interface Weights {
  ram: number;
  storage: number;
  processor: number;
  display: number;
}

export default function Recommender() {
  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  
  const [weights, setWeights] = useState<Weights>({
    ram: 25,
    storage: 25,
    processor: 25,
    display: 25
  });

  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [results, setResults] = useState<RankedLaptop[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortByRating, setSortByRating] = useState(false);
  const [selectedLaptopForDetail, setSelectedLaptopForDetail] = useState<RankedLaptop | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const totalWeight = useMemo(() => 
    (Object.values(weights) as number[]).reduce((a, b) => a + b, 0), 
  [weights]);

  const isValid = totalWeight === 100;

  useEffect(() => {
    const saved = localStorage.getItem("laptop_saw_db");
    const parsed = saved ? JSON.parse(saved) : [];
    const isOldData = parsed.length > 0 && (!parsed[0].processor || !parsed[0].coreNum);

    if (isOldData || (parsed.length > 0 && parsed.length < MOCK_LAPTOPS.length)) {
       setLaptops(MOCK_LAPTOPS);
    } else {
       setLaptops(parsed.length > 0 ? parsed : MOCK_LAPTOPS);
    }
  }, []);

  const resultsWithFilter = useMemo(() => {
    if (laptops.length === 0) return [];
    
    // 1. Filter by Budget
    const filtered = laptops.filter(l => l.price <= maxPrice);
    if (filtered.length === 0) return [];

    // 2. Prepare Weights for SAW (decimal)
    const decimalWeights = {
      ram: weights.ram / 100,
      storage: weights.storage / 100,
      processor: weights.processor / 100,
      display: weights.display / 100
    };

    // 3. Calculate SAW
    return calculateSAW(filtered, decimalWeights);
  }, [weights, laptops, maxPrice]);

  // Keep results synchronized with filter
  useEffect(() => {
    setResults(resultsWithFilter);
  }, [resultsWithFilter]);

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    // Presets for budget based on category
    const defaultBudget = cat === "Student" ? 15000000 : cat === "Office/Work" ? 25000000 : 80000000;
    setMaxPrice(defaultBudget);
    
    const preset = CATEGORY_WEIGHTS[cat];
    setWeights({
      ram: Math.round(preset.ram * 100),
      storage: Math.round(preset.storage * 100),
      processor: Math.round(preset.processor * 100),
      display: Math.round(preset.display * 100),
    });
    setStep("weights");
  };

  const updateWeight = (key: keyof Weights, newValue: number) => {
    const currentTotalWithoutSelf = totalWeight - weights[key];
    const allowedMax = 100 - currentTotalWithoutSelf;
    const finalValue = Math.min(newValue, allowedMax);
    
    setWeights(prev => ({ ...prev, [key]: finalValue }));
  };

  const getRecommendationReason = (laptop: RankedLaptop) => {
    const sortedWeights = (Object.entries(weights) as [string, number][]).sort((a,b) => b[1] - a[1]);
    const topKey = sortedWeights[0][0];
    
    let reason = `${laptop.model} terpilih sebagai rekomendasi utama sistem karena memiliki kombinasi spesifikasi tertinggi yang paling sesuai dengan profil prioritas Anda. `;
    
    if (topKey === 'processor') reason += `Laptop ini unggul pada sektor pemrosesan dengan unit ${laptop.processor || 'prosesor performa tinggi'}, sangat ideal untuk kebutuhan komputasi intensif Anda.`;
    else if (topKey === 'ram') reason += `Kapasitas RAM sebesar ${laptop.ram}GB memberikan kontribusi skor terbesar dalam pemenuhan kebutuhan multitasking Anda.`;
    else if (topKey === 'storage') reason += `Ruang penyimpanan luas ${laptop.storage >= 1000 ? (laptop.storage/1000).toFixed(0) + 'TB' : laptop.storage + 'GB'} SSD menjadi faktor penentu utama yang mendukung kenyamanan penyimpanan data Anda.`;
    else if (topKey === 'display') reason += `Kualitas visual pada layar ${laptop.display}" memberikan pengalaman imersif yang menjadi fokus utama Anda dalam pemilihan ini.`;

    return reason;
  };

  const runFinalAnalysis = async () => {
    if (!isValid) return;
    setStep("results");
    if (results.length > 0) {
      setIsAnalyzing(true);
      // Wait for 1s to feel like local processing
      await new Promise(r => setTimeout(r, 800));
      setExplanation(getRecommendationReason(results[0]));
      setIsAnalyzing(false);
    }
  };

  const displayResults = useMemo(() => {
    if (!sortByRating) return results;
    return [...results].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [results, sortByRating]);

  const topPriority = useMemo(() => {
    const entries = Object.entries(weights) as [string, number][];
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [weights]);

  const handleOpenDetail = (laptop: RankedLaptop) => {
    setSelectedLaptopForDetail(laptop);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="mr-8 group">
            <Logo showText={true} />
          </Link>
          {step === "category" && (
            <Link 
              to="/" 
              className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">DSS Mode</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">SAW Method v2.0</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              Professional <span className="text-indigo-600">Recommender</span>
            </h1>
            <p className="text-slate-400 font-medium mt-1">Sistem Pendukung Keputusan Pemilihan Laptop Berbasis Kriteria Terbobot.</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "category" && (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 text-left ring-1 ring-slate-100 transition-all hover:ring-indigo-500 hover:shadow-2xl active:scale-[0.98]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-600 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6">
                   {cat === "Gaming" && <Trophy size={32} />}
                   {cat === "Office/Work" && <Shield size={32} />}
                   {cat === "Student" && <Info size={32} />}
                   {cat === "Programming" && <Settings size={32} />}
                   {cat === "Content Creator" && <Sparkles size={32} />}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{cat}</h3>
                <p className="mt-2 text-sm text-slate-400 font-medium">Reset bobot kriteria untuk skenario {cat.toLowerCase()}.</p>
                <div className="mt-8 flex items-center gap-2">
                   <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 w-0 group-hover:w-full transition-all duration-500" />
                   </div>
                   <span className="text-[10px] font-black uppercase text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">Mulai Analisis</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === "weights" && (
          <motion.div
            key="weights"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Control Panel */}
            <div className="lg:col-span-8 space-y-6">
               <div className="bg-white p-10 rounded-[3rem] ring-1 ring-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setStep("category")} 
                          className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm group"
                        >
                          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                           <h2 className="text-2xl font-black text-slate-900">Konfigurasi Bobot</h2>
                           <p className="text-slate-400 text-sm font-medium">Tentukan prioritas kriteria sesuai kebutuhan Anda.</p>
                        </div>
                     </div>
                     <div className="hidden sm:block text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Skenario</p>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">{selectedCategory}</span>
                     </div>
                  </div>

                  {/* Budget Filter */}
                  <div className="mb-10 bg-amber-50/50 p-8 rounded-[2rem] ring-1 ring-amber-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="text-amber-600" size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-900">Saringan Budget Maksimal</h4>
                      </div>
                      <span className="text-xl font-black text-amber-600">Rp {(maxPrice/1000000).toFixed(1)}jt</span>
                    </div>
                    <input 
                      type="range"
                      min="2000000"
                      max="150000000"
                      step="1000000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-amber-200/50 rounded-full appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  <div className="space-y-8">
                    {Object.entries(weights).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between items-end mb-3">
                           <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">{key}</label>
                           <span className="text-xl font-black text-indigo-600">{val}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={val}
                          onChange={(e) => updateWeight(key as keyof Weights, parseInt(e.target.value))}
                          className={`w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer transition-all ${totalWeight >= 100 && val === weights[key as keyof Weights] ? 'accent-slate-400' : 'accent-indigo-600'}`}
                        />
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Status Panel */}
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-slate-900 p-8 rounded-[3rem] text-white overflow-hidden relative border-t-4 border-indigo-500">
                  <div className="absolute -top-10 -right-10 text-white/5 rotate-12"><Zap size={200} /></div>
                  <div className="relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-[4px] text-indigo-400 mb-8 flex items-center gap-2">
                       <Shield size={12} />
                       AI Validation Engine
                    </div>
                    <div className="mb-10 text-center">
                       <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Total Akumulasi</div>
                       <div className={`text-6xl font-black transition-colors ${isValid ? 'text-indigo-400' : 'text-amber-500'}`}>{totalWeight}%</div>
                       <div className="mt-4 flex flex-col items-center gap-1">
                          {isValid ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                               <Check size={14} /> Berhasil divalidasi
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                               <Info size={14} /> Harus tepat 100%
                            </div>
                          )}
                       </div>
                    </div>
                    <button 
                      disabled={!isValid}
                      onClick={runFinalAnalysis}
                      className={`w-full py-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isValid ? 'bg-indigo-600 hover:bg-white hover:text-slate-900 cursor-pointer shadow-xl shadow-indigo-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                    >
                      Jalankan SAW Logic
                    </button>
                    {!isValid && (
                       <p className="mt-4 text-[9px] text-center font-bold text-slate-500 uppercase tracking-widest">
                          Sistem Terkunci: Sesuaikan bobot hingga mencapai 100%
                       </p>
                    )}
                  </div>
               </div>

               {results.length > 0 && (
                 <div className="bg-white p-8 rounded-[2.5rem] ring-1 ring-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                       <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-Time Top 10 Preview</div>
                       <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">Live Update</div>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                       {results.slice(0, 10).map((laptop, idx) => (
                         <div key={laptop.id} className="flex items-center gap-4 group">
                            <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${idx === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                               #{idx + 1}
                            </div>
                            <div className="min-w-0">
                               <p className="text-[10px] font-black text-indigo-600 truncate uppercase tracking-tighter">{laptop.brand}</p>
                               <h4 className="font-bold text-slate-900 text-sm truncate leading-tight">{laptop.model}</h4>
                               <p className="text-[10px] font-bold text-slate-400 mt-0.5">SAW Score: {laptop.score.toFixed(1)}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                   <button onClick={() => setStep("weights")} className="h-12 w-12 rounded-2xl bg-white ring-1 ring-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft /></button>
                   <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Hasil Analisis</h2>
                    <div className="flex gap-3 mt-1.5">
                         {(Object.entries(weights) as [string, number][]).filter(([_, v]) => v >= 30).map(([k]) => (
                            <span key={k} className="text-[8px] font-black uppercase tracking-widest text-white bg-indigo-600 px-3 py-1 rounded-md shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-400/50">Priority: {k}</span>
                         ))}
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-900/50 px-3 py-1 rounded-md ring-1 ring-slate-800">Budget Limit: {(maxPrice/1000000).toFixed(0)}jt</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={() => setSortByRating(!sortByRating)} 
                     className={`px-6 py-3 ring-1 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${sortByRating ? 'bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'}`}
                   >
                     <Star size={14} fill={sortByRating ? 'currentColor' : 'none'} /> 
                     {sortByRating ? 'Rating Sorted' : 'Sort by Rating'}
                   </button>
                   <button onClick={() => setShowMatrix(true)} className="px-6 py-3 bg-white ring-1 ring-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-xl hover:bg-slate-50 flex items-center gap-2"><LayoutList size={14} /> Detail Matriks</button>
                   <button onClick={() => setStep("category")} className="px-6 py-3 bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-xl shadow-indigo-100 hover:bg-black transition-all">Skenario Baru</button>
                </div>
             </div>

             {displayResults.length > 0 && (
               <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-1 md:p-2 border-b-8 border-indigo-600 shadow-3xl">
                  <div className="flex flex-col lg:flex-row bg-slate-900 rounded-[2.8rem] overflow-hidden">
                     <div className="lg:w-1/2 relative h-[400px] lg:h-auto">
                        <img src={displayResults[0].image} className="absolute inset-0 w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
                        <div className="absolute top-10 left-10">
                           <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[3px] rounded-full inline-flex items-center gap-2"><Trophy size={14} /> {sortByRating ? 'Highest Rated' : 'Rekomendasi Utama'}</div>
                        </div>
                     </div>
                     <div className="flex-1 p-10 lg:p-16 text-white">
                        <div className="flex items-start justify-between gap-6 mb-12">
                           <div>
                              <p className="text-indigo-400 font-black uppercase tracking-[4px] text-xs mb-2">{displayResults[0].brand}</p>
                              <h3 className="text-5xl font-black tracking-tighter leading-tight">{displayResults[0].model}</h3>
                           </div>
                           <div className="shrink-0 bg-white/5 border border-white/10 rounded-3xl p-6 text-center backdrop-blur-xl">
                              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">
                                 {sortByRating ? 'Quality Rating' : 'SAW Final Score'}
                              </p>
                              <p className="text-5xl font-black italic">
                                 {sortByRating ? displayResults[0].rating?.toFixed(1) : displayResults[0].score.toFixed(1)}
                              </p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 py-10 border-y border-white/5">
                           {[
                              { l: 'Price', v: `Rp ${(displayResults[0].price/1000000).toFixed(1)}jt`, i: Target },
                              { l: 'RAM', v: `${displayResults[0].ram}GB`, i: Zap },
                              { l: 'Storage', v: displayResults[0].storage >= 1000 ? `${(displayResults[0].storage/1000).toFixed(0)}TB` : `${displayResults[0].storage}GB`, i: Info },
                              { l: 'Processor', v: displayResults[0].processor || "Processor Information Unavailable", i: Settings },
                           ].map(item => (
                              <div key={item.l} className="relative group">
                                 <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors">{item.l}</p>
                                 <p className={`font-black text-white ${item.l === 'Processor' ? 'text-sm leading-tight' : 'text-xl'}`}>{item.v}</p>
                              </div>
                           ))}
                        </div>

                        <div className="space-y-4">
                           <div className="flex items-center gap-2 text-indigo-400">
                              <Sparkles size={16} />
                              <span className="text-[10px] font-black uppercase tracking-[4px]">Analisis Rekomendasi</span>
                           </div>
                           <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
                              {isAnalyzing ? (
                                <div className="flex items-center gap-3">
                                   <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                   <span className="text-sm font-bold text-slate-500 animate-pulse">Menghitung kontribusi kriteria...</span>
                                </div>
                              ) : <p className="text-lg font-medium leading-relaxed italic text-slate-300">"{explanation}"</p>}
                           </div>

                           <button 
                             onClick={() => handleOpenDetail(displayResults[0])}
                             className="group flex items-center gap-3 px-8 py-5 bg-indigo-600 rounded-2xl text-xs font-black uppercase tracking-[3px] text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl shadow-indigo-500/20"
                           >
                              View Full System Details
                              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                   <Target size={20} className="text-indigo-600" />
                   Alternatif Rekomendasi ({displayResults.length > 0 ? displayResults.length - 1 : 0})
                </h3>
                <div className="text-[10px] font-black uppercase text-slate-400">
                   Menampilkan hasil berdasarkan {sortByRating ? 'Rating Tertinggi' : 'skor preferensi Anda'}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayResults.slice(1).map((laptop, idx) => (
                   <AlternativeCard 
                     key={laptop.id} 
                     laptop={laptop} 
                     rank={idx + 2} 
                     onClick={() => handleOpenDetail(laptop)} 
                   />
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Modal */}
      <AnimatePresence>
         {showMatrix && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 md:p-10 backdrop-blur-md"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-5xl bg-white rounded-[3rem] shadow-3xl overflow-hidden flex flex-col h-full max-h-[800px]"
              >
                 <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Matriks Keputusan SAW</h2>
                      <p className="text-sm font-medium text-slate-400">Detail normalisasi (R) dan perhitungan skor akhir (V).</p>
                    </div>
                    <button onClick={() => setShowMatrix(false)} className="h-12 w-12 rounded-2xl bg-white ring-1 ring-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600"><X /></button>
                 </div>
                 <div className="flex-1 overflow-auto p-8">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-slate-100">
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Laptop Alternatif</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">RAM (N)</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Storage (N)</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Processor (N)</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Display (N)</th>
                             <th className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Result Score</th>
                          </tr>
                       </thead>
                       <tbody>
                          {results.map((l) => (
                             <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="py-5 px-4 font-black text-slate-900 whitespace-nowrap">
                                    <div className="flex flex-col">
                                       <span className="truncate max-w-[200px]">{l.brand} {l.model}</span>
                                       <span className="text-[9px] text-slate-400 italic font-medium">{l.processor}</span>
                                    </div>
                                 </td>
                                <td className="py-5 px-4 font-mono text-xs text-slate-500">{l.normalized.ram.toFixed(3)}</td>
                                <td className="py-5 px-4 font-mono text-xs text-slate-500">{l.normalized.storage.toFixed(3)}</td>
                                <td className="py-5 px-4 font-mono text-xs text-slate-500">{l.normalized.processor.toFixed(3)}</td>
                                <td className="py-5 px-4 font-mono text-xs text-slate-500">{l.normalized.display.toFixed(3)}</td>
                                <td className="py-5 px-4"><span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-lg">{l.score.toFixed(2)}</span></td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="p-8 bg-indigo-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div>
                          <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Weighting Applied</p>
                          <p className="text-sm font-bold">R:{weights.ram}% | S:{weights.storage}% | Pr:{weights.processor}% | D:{weights.display}%</p>
                       </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Pure SAW Algorithm v2.1 (Benefit Only)</div>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
       <LaptopDetailModal 
        laptop={selectedLaptopForDetail}
        weights={weights}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        rank={displayResults.findIndex(r => r.id === selectedLaptopForDetail?.id) + 1}
      />
    </div>
  );
}
