import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Lock, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
  const { status } = useWebSocket();
  const { theme, toggleTheme } = useStore();

  const getStatusConfig = () => {
    switch (status) {
      case 'CONNECTED': return { color: 'bg-green-500', text: 'SECURE LINK', shadow: 'shadow-[0_0_8px_#22c55e]' };
      case 'CONNECTING': return { color: 'bg-yellow-500', text: 'HANDSHAKING', shadow: 'shadow-[0_0_8px_#eab308]' };
      case 'DISCONNECTED': return { color: 'bg-red-500', text: 'LINK SEVERED', shadow: 'shadow-[0_0_8px_#ef4444]' };
      default: return { color: 'bg-gray-500', text: 'UNKNOWN', shadow: '' };
    }
  };

  const config = getStatusConfig();

  return (
    <header className="h-14 border-b border-[#00ffc8]/30 flex items-center justify-between px-6 bg-white dark:bg-[#050505] z-50 transition-colors">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="font-black tracking-widest text-[#0ea5e9] dark:text-[#00ffc8] text-lg leading-none transition-colors">HAVEN OS</span>
          <span className="text-[10px] text-slate-400 dark:text-[#00ffc8]/50 font-bold uppercase tracking-[0.2em] transition-colors">Sovereign Core v4.0.0</span>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-slate-200 dark:border-white/10 pl-6">
          <span className="text-slate-600 dark:text-[#00ffc8]">NIYAH v3.0</span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-2">
            <Lock size={12} className="text-slate-600 dark:text-[#00ffc8]" />
            Sovereign Mode
          </span>
        </div>
      </div>
      
      {/* 🛡️ WS Status Indicator & Theme Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-xl border transition-all",
            theme === 'dark' 
              ? "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10" 
              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
          )}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group hover:border-[#00ffc8]/30 transition-all cursor-pointer">
          <div className={`w-2 h-2 rounded-full ${config.color} ${config.shadow} animate-pulse`} />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-700 dark:text-white">{config.text}</span>
        </div>
      </div>
    </header>
  );
};
