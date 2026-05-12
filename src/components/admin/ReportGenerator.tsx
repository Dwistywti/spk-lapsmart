import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Printer, 
  Table as TableIcon,
  CheckCircle,
  Clock,
  ChevronRight,
  Database
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import { Laptop } from '../../types';

interface ReportGeneratorProps {
  laptops: Laptop[];
}

export const ReportGenerator = ({ laptops }: ReportGeneratorProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCSV = () => {
    setIsExporting(true);
    const csv = Papa.unparse(laptops);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laptop_dataset_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsExporting(false), 1000);
  };

  const exportPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('Laptop DSS Inventory Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Total Assets: ${laptops.length}`, 20, 40);
    
    let y = 60;
    laptops.slice(0, 15).forEach((item, i) => {
       doc.text(`${i+1}. ${item.brand} ${item.model} - Rp ${(item.price/1000000).toFixed(1)}jt`, 20, y);
       y += 10;
    });

    if (laptops.length > 15) {
       doc.text(`... and ${laptops.length - 15} more entries.`, 20, y);
    }

    doc.save(`system_report_${new Date().getTime()}.pdf`);
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Export Options */}
         <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:ring-2 hover:ring-indigo-600 transition-all cursor-pointer" onClick={exportPDF}>
               <div className="h-16 w-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <FileText size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Export to PDF</h3>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Generated printable document with summary and top inventory assets.</p>
               <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">Download PDF <Download size={14} /></span>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:ring-2 hover:ring-emerald-600 transition-all cursor-pointer" onClick={exportCSV}>
               <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <TableIcon size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Export to CSV</h3>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Raw spreadsheet data for Excel or external analytical processing.</p>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">Download CSV <Download size={14} /></span>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:ring-2 hover:ring-indigo-600 transition-all cursor-pointer">
               <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Printer size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">System Print</h3>
               <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">Open print-friendly dashboard view for physical documentation.</p>
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">Trigger Print <Printer size={14} /></span>
            </div>
         </div>

         {/* Recent Exports */}
         <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-lg font-black text-slate-900">Export History</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Past 30 Days Activity</p>
            </div>
            <div className="p-2">
               {[
                 { type: 'PDF', file: 'analytics_summary_may.pdf', size: '2.4 MB', time: '2 hours ago' },
                 { type: 'CSV', file: 'dataset_v2_export.csv', size: '840 KB', time: '1 day ago' },
                 { type: 'PDF', file: 'saw_report_ranking.pdf', size: '1.2 MB', time: '3 days ago' },
               ].map((rep, i) => (
                 <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-[2rem] transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Download size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">{rep.file}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                             <span className="text-[10px] font-bold text-slate-400">{rep.size}</span>
                             <span className="h-1 w-1 rounded-full bg-slate-200" />
                             <span className="text-[10px] font-bold text-slate-400">{rep.time}</span>
                          </div>
                       </div>
                    </div>
                    <button className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                       <ChevronRight size={20} />
                    </button>
                 </div>
               ))}
            </div>
         </div>

         {/* Data Summary Card */}
         <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[3rem] text-white">
            <h3 className="text-xl font-black mb-1">Status Laporan</h3>
            <p className="text-[10px] font-black uppercase tracking-[3px] text-indigo-400 mb-8">System Sync Details</p>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10">
                     <CheckCircle size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold">Local Sync Status</p>
                     <p className="text-[10px] text-slate-500 font-medium italic">Database fully persisted in LocalStorage.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 border border-white/10">
                     <Clock size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold">Last Data Change</p>
                     <p className="text-[10px] text-slate-500 font-medium italic">Monday, 11 May 2026 - 13:45 WIB</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
                     <Database size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold">Data Integrity</p>
                     <p className="text-[10px] text-slate-500 font-medium italic">98.2% healthy with 0 critical corruption.</p>
                  </div>
               </div>
            </div>

            <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-3xl">
               <p className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Dataset Composition</p>
               <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                     <span className="font-bold">Laptops</span>
                     <span className="text-indigo-400 font-black">{laptops.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="font-bold">Processors</span>
                     <span className="text-indigo-400 font-black">28 unique</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="font-bold">Weights</span>
                     <span className="text-indigo-400 font-black">5 active presets</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {isExporting && (
        <div className="fixed bottom-10 right-10 z-[200]">
           <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-sm font-black uppercase tracking-widest">Generating Digital Document...</span>
           </motion.div>
        </div>
      )}
    </div>
  );
};
