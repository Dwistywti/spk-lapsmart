import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Database,
  Shield,
  LayoutDashboard,
  Package,
  Activity,
  History,
  Settings,
  ChevronRight,
  Menu
} from "lucide-react";
import { Laptop, CATEGORY_WEIGHTS, CategoryWeights } from "../types";
import { MOCK_LAPTOPS } from "../data/mockLaptops";
import { Link } from "react-router-dom";
import { calculateProcessorScore } from "../utils/laptopUtils";

// Admin Sub-components
import { DashboardOverview } from "../components/admin/DashboardOverview";
import { InventoryManager } from "../components/admin/InventoryManager";
import { CategoryManager } from "../components/admin/CategoryManager";
import { SAWAnalysisPanel } from "../components/admin/SAWAnalysisPanel";

type AdminTab = 
  | "dashboard" 
  | "inventory" 
  | "saw" 
  | "settings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [globalWeights, setGlobalWeights] = useState<CategoryWeights>(CATEGORY_WEIGHTS);

  useEffect(() => {
    const saved = localStorage.getItem("laptop_saw_db");
    const savedLaptops = saved ? JSON.parse(saved) : [];
    const isOldData = savedLaptops.length > 0 && (!savedLaptops[0].processor || !savedLaptops[0].coreNum);
    
    if ((savedLaptops.length > 0 && savedLaptops.length < MOCK_LAPTOPS.length) || isOldData) {
      setLaptops(MOCK_LAPTOPS);
      localStorage.setItem("laptop_saw_db", JSON.stringify(MOCK_LAPTOPS));
    } else if (savedLaptops.length > 0) {
      setLaptops(savedLaptops);
    } else {
      setLaptops(MOCK_LAPTOPS);
      localStorage.setItem("laptop_saw_db", JSON.stringify(MOCK_LAPTOPS));
    }

    const savedWeights = localStorage.getItem("laptop_saw_weights");
    if (savedWeights) {
      setGlobalWeights(JSON.parse(savedWeights));
    }
  }, []);

  const saveToStorage = (updated: Laptop[]) => {
    setLaptops(updated);
    localStorage.setItem("laptop_saw_db", JSON.stringify(updated));
  };

  const handleAddLaptop = (laptop: Partial<Laptop>) => {
    const score = calculateProcessorScore(Number(laptop.coreNum) || 0, Number(laptop.threadsNum) || 0);
    const newLaptop: Laptop = {
      ...laptop as Laptop,
      processorScore: score,
      id: Math.random().toString(36).substr(2, 9)
    };
    saveToStorage([...laptops, newLaptop]);
  };

  const handleEditLaptop = (laptop: Laptop) => {
    const score = calculateProcessorScore(Number(laptop.coreNum) || 0, Number(laptop.threadsNum) || 0);
    const updatedLaptop = { ...laptop, processorScore: score };
    const updated = laptops.map(l => l.id === updatedLaptop.id ? updatedLaptop : l);
    saveToStorage(updated);
  };

  const handleDeleteLaptop = (id: string) => {
    if (confirm("Hapus data laptop ini? Database akan diperbarui secara real-time.")) {
      saveToStorage(laptops.filter(l => l.id !== id));
    }
  };

  const resetDB = () => {
    if (confirm("Reset database ke data awal? Semua perubahan akan hilang.")) {
      saveToStorage(MOCK_LAPTOPS);
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "saw", label: "SAW Analysis", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 80 }}
        className="relative bg-white border-r border-slate-100 flex flex-col z-[50]"
      >
        <div className="h-24 px-6 flex items-center justify-between border-b border-slate-50">
           {isSidebarOpen ? (
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                   <Shield size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-slate-900 tracking-tight leading-none uppercase text-xs">Lapsmart Admin</span>
                   <span className="text-[10px] font-bold text-slate-400 mt-1 italic uppercase tracking-widest">Decision Support</span>
                </div>
             </div>
           ) : (
             <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg">
                <Shield size={20} />
             </div>
           )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
           {menuItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as AdminTab)}
               className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-600'} transition-colors`}>
                   <item.icon size={20} />
                </div>
                {isSidebarOpen && (
                   <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm font-black tracking-tight">{item.label}</span>
                      {activeTab === item.id && <ChevronRight size={14} className="opacity-50" />}
                   </div>
                )}
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
           <Link to="/" className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-black text-sm uppercase tracking-widest">
              <X size={20} />
              {isSidebarOpen && "Exit"}
           </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Top Navigation Bar */}
         <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between z-40 sticky top-0">
            <div className="flex items-center gap-6">
               <button 
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="h-12 w-12 rounded-2xl bg-white ring-1 ring-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:ring-indigo-600 shadow-sm transition-all"
               >
                  <Menu size={20} />
               </button>
               <div>
                  <div className="flex items-center gap-2">
                     <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                     <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">SPK Recommendation System</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-black text-slate-900">Administrator</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase">Online</span>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="h-full w-full object-cover" alt="Admin" />
               </div>
            </div>
         </header>

         {/* Scrollable Content */}
         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#F9FBFF]">
            <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                  {activeTab === 'dashboard' && (
                    <DashboardOverview 
                      laptops={laptops} 
                      weights={globalWeights["Office/Work"]} 
                    />
                  )}
                  {activeTab === 'inventory' && (
                    <InventoryManager 
                      laptops={laptops} 
                      onAdd={handleAddLaptop}
                      onEdit={handleEditLaptop}
                      onDelete={handleDeleteLaptop}
                      onReset={resetDB}
                    />
                  )}
                  {activeTab === 'saw' && <SAWAnalysisPanel laptops={laptops} />}
                  {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Weight Presets Management */}
                      <div className="lg:col-span-2">
                        <CategoryManager 
                          weights={globalWeights} 
                          onUpdate={(updated) => {
                            setGlobalWeights(updated);
                            localStorage.setItem("laptop_saw_weights", JSON.stringify(updated));
                          }} 
                        />
                      </div>

                      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                         <h3 className="text-2xl font-black text-slate-900 mb-8">System Settings</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                               <div>
                                  <h4 className="text-sm font-black">Dark Mode</h4>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Switch UI appearance</p>
                               </div>
                               <div className="h-8 w-14 bg-slate-200 rounded-full relative p-1 cursor-pointer">
                                  <div className="h-6 w-6 bg-white rounded-full shadow-sm" />
                               </div>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl">
                               <div>
                                  <h4 className="text-sm font-black">Auto-Sync Data</h4>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Keep database in sync</p>
                               </div>
                               <div className="h-8 w-14 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                                  <div className="h-6 w-6 bg-white rounded-full shadow-sm ml-auto" />
                               </div>
                            </div>
                            <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Save Changes</button>
                         </div>
                      </div>

                      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                         <div>
                            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Dataset Sync</h3>
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                               Gunakan fitur ini untuk menyinkronkan ulang database admin dengan dataset default sistem. 
                               Semua data kustom yang belum tersimpan akan digantikan.
                            </p>
                         </div>
                         <button 
                           onClick={resetDB}
                           className="flex items-center justify-center gap-3 w-full py-5 bg-amber-50 text-amber-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                         >
                           <Database size={18} />
                           Sync Default Dataset
                         </button>
                      </div>
                    </div>
                  )}
               </motion.div>
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
}

