import React from "react";
import { Laptop } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Laptop Frame */}
        <div className="text-blue-600 transition-transform group-hover:scale-105 duration-500">
          <Laptop size={36} strokeWidth={1.5} />
        </div>
        {/* Stylized LS inside Screen Area */}
        <div className="absolute inset-0 flex items-center justify-center -mt-1.5 ml-0.5">
          <div className="flex items-end leading-none translate-y-[1px]">
            <span className="text-[14px] font-[900] tracking-[-0.1em] text-blue-600 skew-x-[-15deg] select-none scale-y-110">
              L
            </span>
            <span className="text-[11px] font-[900] tracking-[-0.05em] text-slate-800 -ml-[1px] select-none">
              S
            </span>
          </div>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="font-black tracking-tighter leading-none text-xl flex items-baseline">
            <span className="text-blue-600">Lap</span>
            <span className="text-slate-900 ml-[1px]">Smart</span>
          </div>
          <p className="text-[7px] font-black uppercase text-slate-400 tracking-[2.5px] mt-1 leading-none">
            SMART DECISION
          </p>
        </div>
      )}
    </div>
  );
};
