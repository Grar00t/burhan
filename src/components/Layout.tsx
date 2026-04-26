import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image, 
  Video, 
  Music, 
  Mic, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert,
  TrendingUp,
  Search,
  MapPin,
  Sparkles,
  BrainCircuit,
  Activity,
  Fingerprint,
  Heart,
  CheckCircle2,
  Lock,
  Skull,
  PlayCircle,
  Target,
  FileSearch,
  LayoutGrid,
  Shield,
  BarChart3,
  Database,
  UserCheck,
  Terminal,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
      active 
        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
        : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
    )}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active-glow"
        className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none"
      />
    )}
    <motion.div
      animate={active ? { scale: [1, 1.1, 1], rotate: [0, 5, 0] } : {}}
      transition={{ duration: 0.5, repeat: active ? Infinity : 0, repeatDelay: 3 }}
    >
      <Icon className={cn("w-5 h-5 relative z-10", active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-200")} />
    </motion.div>
    {!collapsed && (
      <span className={cn(
        "ml-4 font-bold text-xs uppercase tracking-widest relative z-10 transition-all duration-300",
        active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-200"
      )}>
        {label}
      </span>
    )}
    {active && !collapsed && (
      <motion.div 
        layoutId="active-indicator"
        className="ml-auto w-1 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] relative z-10"
      />
    )}
  </button>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  // Local Sovereign Identity
  const user = { uid: 'sovereign_operator_01', displayName: 'Sulaiman Alshammari', photoURL: null };
  const { activeTab, setActiveTab } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Command Center' },
    { id: 'strategy', icon: TrendingUp, label: 'BURHĀN Strategy' },
    { id: 'forensics', icon: Fingerprint, label: 'Forensic Dossier' },
    { id: 'tasks', icon: Shield, label: 'Mission Control' },
    { id: 'ai', icon: BrainCircuit, label: 'NIYAH Engine' },
    { id: 'benchmarks', icon: BarChart3, label: 'Benchmarks' },
    { id: 'kforge', icon: Database, label: 'K-Forge' },
    { id: 'kreport', icon: FileSearch, label: 'K-Report VAPT' },
    { id: 'chat', icon: MessageSquare, label: 'Sovereign AI Chat' },
    { id: 'delegate', icon: UserCheck, label: 'Digital Delegate' },
    { id: 'media', icon: Image, label: 'Media Lab' },
    { id: 'tensors', icon: BarChart3, label: 'Tensor Viz' },
    { id: 'field', icon: Terminal, label: 'Field Tools' },
    { id: 'kspike', icon: Target, label: 'K-SPIKE v1.0' },
    { id: 'phalanx', icon: Skull, label: 'Phalanx Guardian' },
    { id: 'ethics', icon: Scale, label: 'Fitrah Ethics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    // Sovereign operator cannot be signed out from their own node
    console.log("[NIYAH] Local logout ignored - Sovereign sessions are persistent.");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 font-sans overflow-hidden relative transition-colors duration-300">
      {/* Cinematic Background Effects */}
      <div className="grid-bg opacity-30 dark:opacity-100" />
      <div className="scanlines opacity-5 dark:opacity-15" />
      
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-slate-200 dark:border-white/5 glass-genius transition-all duration-500 ease-in-out z-50",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className="p-8 flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-white/10"
          >
            <ShieldAlert className="w-7 h-7 text-white" />
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-white/40">
                COIN MAX
              </span>
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 tracking-[0.2em] uppercase opacity-80">
                Sovereign Strategy
              </span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 space-y-4 bg-slate-100/50 dark:bg-black/20">
          <div className="px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 mb-2">
            <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] text-center">
              Powered by Khawrizm Network
            </p>
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center w-full p-3 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-300 group rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/5"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
              {collapsed ? <Menu className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5" />}
            </motion.div>
            {!collapsed && <span className="ml-3 text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100">Collapse Node</span>}
          </button>
          
          {user && (
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-200 dark:hover:bg-white/[0.04]", 
              collapsed && "justify-center px-0"
            )}>
              <div className="relative">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-50 dark:border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black truncate text-slate-900 dark:text-white uppercase tracking-tight">{user.displayName || 'SULAIMAN ALSHA...'}</p>
                  <p className="text-[9px] text-slate-500 truncate font-mono">@sulaiman_alsha</p>
                </div>
              )}
              {!collapsed && (
                <button onClick={handleSignOut} className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Status Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-white/5 glass-genius flex items-center justify-between px-8 z-40 relative overflow-hidden">
          {/* Animated Glow Line */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
          />

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <span className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase">Sovereign Mode: Active</span>
            </div>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span className="text-white">NIYAH v3.0</span>
              <span className="opacity-30">•</span>
              <span className="text-blue-400">ARM64 Native</span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-blue-500" />
                Quantum Encrypted
              </span>
              <span className="opacity-30">•</span>
              <span>April 2026</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all cursor-pointer">
              <Activity className="w-4 h-4 text-blue-400 group-hover:animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latency</span>
                <span className="text-[10px] font-mono text-blue-400">12.4ms</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header (Overlay) */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-[60]">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-blue-500" />
            <span className="font-black text-lg tracking-tighter">NIYAH</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-white/5">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Main Scrollable Content */}
        <main className="flex-1 relative overflow-y-auto pt-16 md:pt-0 custom-scrollbar">
          <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="md:hidden fixed inset-0 z-[55] bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#020617] border-l border-white/10 p-8 pt-24 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full p-4 rounded-2xl text-sm font-bold transition-all duration-300",
                    activeTab === item.id 
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                      : "text-slate-400 hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mr-4", activeTab === item.id ? "text-blue-400" : "text-slate-500")} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
