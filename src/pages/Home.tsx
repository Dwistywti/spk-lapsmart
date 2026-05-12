import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, LogOut, User as UserIcon, Shield, Database, LayoutGrid, Star, ChevronRight } from "lucide-react";
import { Logo } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { MOCK_LAPTOPS } from "../data/mockLaptops";
import { LaptopDetailModal } from "../components/LaptopDetailModal";
import { RankedLaptop } from "../utils/sawAlgorithm";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [totalLaptops, setTotalLaptops] = useState(0);
  const [featuredLaptops, setFeaturedLaptops] = useState<RankedLaptop[]>([]);
  const [selectedLaptop, setSelectedLaptop] = useState<RankedLaptop | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("laptop_saw_db");
    const laptops = saved ? JSON.parse(saved) : MOCK_LAPTOPS;
    setTotalLaptops(laptops.length);
    
    // Sort by rating and pick top 6 for featured section
    const ranked = laptops.map((l: any) => ({
      ...l,
      score: l.rating * 20, // Mock score for modal
      normalized: { ram: 1, storage: 1, processor: 1, display: 1 } // Mock normalized for modal
    })).sort((a: any, b: any) => b.rating - a.rating).slice(0, 6);
    
    setFeaturedLaptops(ranked);
  }, []);

  const handleOpenDetail = (laptop: RankedLaptop) => {
    setSelectedLaptop(laptop);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      {/* Navbar/Header Status */}
      <nav className="fixed top-0 z-50 w-full bg-white/50 backdrop-blur-md px-4 py-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo showText={true} />
          </Link>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4 bg-white p-1.5 pr-5 rounded-full ring-1 ring-slate-200 shadow-sm">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white shadow-sm ${user.role === 'admin' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-blue-600 shadow-blue-100'}`}>
                  {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-black uppercase leading-none tracking-[1.5px] ${user.role === 'admin' ? 'text-indigo-400' : 'text-blue-400'}`}>
                    {user.role} Account
                  </span>
                  <span className="text-sm font-bold text-slate-700 tracking-tight">{user.username}</span>
                </div>
                {user.role === 'admin' && (
                  <>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <Link 
                      to="/admin"
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider hover:bg-indigo-100 transition-colors"
                    >
                      Control Panel
                    </Link>
                  </>
                )}
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button 
                  onClick={logout}
                  className="p-1.5 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link 
                  to="/login"
                  className="text-xs font-black uppercase tracking-[2px] text-slate-400 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/recommender"
                  className="rounded-full bg-slate-900 px-6 py-2.5 text-xs font-black uppercase tracking-[2px] text-white hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                >
                  Try Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Background Ornaments */}
      <div className="absolute top-0 -z-10 h-screen w-full opacity-40">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-100 blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-100 blur-3xl opacity-50" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[2px] text-blue-700 ring-1 ring-inset ring-blue-700/10">
              Personalized Decision Support
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 text-5xl font-black tracking-tight text-slate-900 sm:text-7xl"
          >
            Temukan Laptop <br />
            <span className="text-blue-600 underline decoration-slate-200 underline-offset-8">Sesuai Kebutuhan</span>
          </motion.h1>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.15 }}
             className="mt-6 flex items-center justify-center gap-4"
          >
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
                <Database size={16} className="text-blue-600" />
                <span className="text-xl font-black text-slate-900">{totalLaptops}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Assets</span>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
                <Zap size={16} className="text-amber-500" />
                <span className="text-xl font-black text-slate-900">SAW</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Algorithm</span>
             </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg text-slate-500 font-medium"
          >
            Sistem cerdas berbasis metode SAW yang menyesuaikan kriteria secara adaptif untuk memberikan rekomendasi paling akurat dan transparan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {user?.role === 'admin' ? (
              <Link
                to="/admin"
                className="group flex items-center gap-2 rounded-2xl bg-indigo-600 px-10 py-5 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:shadow-xl active:scale-95"
              >
                Go to Control Panel
                <Shield className="transition-transform group-hover:scale-110" size={18} />
              </Link>
            ) : (
              <Link
                to="/recommender"
                className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-10 py-5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
              >
                Get Started Now
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="rounded-2xl bg-white px-10 py-5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-50"
              >
                Sign In to Explore
              </Link>
            )}
            {user?.role === 'user' && (
               <Link
                to="/recommender"
                className="rounded-2xl bg-white px-10 py-5 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-50"
              >
                New Recommendation
              </Link>
            )}
          </motion.div>
        </div>

        {/* Features Preview */}
        <div className="mt-48 grid grid-cols-1 gap-16 md:grid-cols-3">
          {[
            { icon: Zap, title: "Adaptive Weighting", desc: "Bobot kriteria berubah otomatis sesuai kategori kebutuhan user secara presisi.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: CheckCircle2, title: "SAW Methodology", desc: "Perhitungan matematis transparan dengan normalisasi data yang teruji.", color: "text-indigo-600", bg: "bg-indigo-50" },
            { icon: ShieldCheck, title: "AI Integration", desc: "Penjelasan alasan rekomendasi didukung oleh teknologi cerdas Gemini AI.", color: "text-emerald-600", bg: "bg-emerald-50" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="relative group pr-4"
            >
              <div className={`mb-8 inline-flex h-16 w-16 items-center justify-center rounded-3xl ${feature.bg} ${feature.color} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="mt-4 text-slate-500 text-base leading-relaxed font-medium">{feature.desc}</p>
              <div className={`mt-8 h-1 w-12 ${feature.bg} transition-all group-hover:w-full`} />
            </motion.div>
          ))}
        </div>
      </div>

      <LaptopDetailModal 
        laptop={selectedLaptop}
        weights={{ ram: 25, storage: 25, processor: 25, display: 25 }}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        rank={0}
      />
    </div>
  );
}
