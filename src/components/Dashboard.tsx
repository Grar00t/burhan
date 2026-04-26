import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  ShieldAlert, 
  Users, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Globe, 
  Radio,
  BrainCircuit,
  Skull
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

// Stub for local synthesizer if actual FFI isn't loaded
const sovereignSynthesizer = {
    speak: async (text: string) => {
        console.log(`[SOVEREIGN_ENGINE] Synthesizing: ${text}`);
        // In a real sovereign stack, this would call a local C++ / Rust FFI
        // For the demo, we use basic Web Speech API as it remains local to the browser
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    }
};

const StatCard = ({ icon: Icon, label, value, trend, colorClass }: any) => (
  <div className="glass p-8 rounded-[32px] border-white/5 group hover:border-white/10 transition-all duration-500 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500", colorClass)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
          trend > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
        )}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
      <h3 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white tabular-nums">{value}</h3>
    </div>
    
    {/* Animated Background Glow */}
    <div className={cn(
      "absolute -bottom-12 -right-12 w-24 h-24 blur-[40px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700",
      colorClass.includes('blue') ? 'bg-blue-500' : 
      colorClass.includes('rose') ? 'bg-rose-500' : 
      colorClass.includes('indigo') ? 'bg-indigo-500' : 'bg-amber-500'
    )} />
  </div>
);

const AlertItem = ({ type, title, time, status }: any) => (
  <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300 group cursor-pointer">
    <div className={cn(
      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-105",
      type === 'critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]" : 
      type === 'warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
    )}>
      {type === 'critical' ? <AlertTriangle className="w-7 h-7" /> : 
       type === 'warning' ? <Zap className="w-7 h-7" /> : <Radio className="w-7 h-7" />}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-black text-slate-900 dark:text-white/90 truncate group-hover:text-blue-600 dark:group-hover:text-white transition-colors uppercase tracking-tight">{title}</h4>
      <div className="flex items-center gap-4 mt-2">
        <span className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" /> {time}
        </span>
        <div className="flex items-center gap-1.5">
          <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-slate-600")} />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            status === 'Active' ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
          )}>
            {status}
          </span>
        </div>
      </div>
    </div>
    <button className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-all rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
      <TrendingUp className="w-5 h-5" />
    </button>
  </div>
);

import { SovereignFeed } from './SovereignFeed';

export default function Dashboard() {
  const { setActiveTab } = useStore();
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', title: "ALPHA-7-EXFIL: Child SIGINT Detected", time: "Just now", status: "Active" },
    { id: 2, type: 'critical', title: "TRON: TCHFcs... SAR 600M Hemorrhage", time: "15 mins ago", status: "Alert" },
    { id: 3, type: 'warning', title: "AS139341: IceStark Micro-Frontend Bypass", time: "45 mins ago", status: "Monitoring" },
    { id: 4, type: 'critical', title: "PDPL Violation: Unauthorized TMT Sync", time: "1 hour ago", status: "Alert" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = {
        id: Date.now(),
        type: Math.random() > 0.7 ? 'critical' : 'warning',
        title: `INCIDENT-${Math.floor(Math.random() * 1000)}: System Threat Detected`,
        time: 'Just now',
        status: 'Active'
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 5));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const playBriefing = async () => {
    try {
      const briefingText = "Command Center initialized. COIN MAX Sovereign Node 001 is active. We are currently orchestrating Operation Black Hole. Our Sensory Lobe has detected 70 predatory apps connected to the Dragon403 syndicate. Tracking 33 TRON mixer wallets linked to Tencent Cloud infrastructure. Awaiting your strategic directives, Sulaiman.";
      await sovereignSynthesizer.speak(briefingText);
    } catch (err) {
      console.error("Briefing failed:", err);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-blue-500" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Sovereign Node: 001-COINMAX</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-[0.9]">
            COIN <span className="text-blue-600 dark:text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">MAX</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed mb-8">
            Saudi Arabia's Strategic Sovereign AI Hub. Orchestrating <span className="text-slate-900 dark:text-white font-bold tracking-tight italic">Operation Black Hole</span> to dismantle the Dragon403 fraudulent networks.
          </p>
          <button 
            onClick={playBriefing}
            className="group flex items-center gap-4 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl shadow-blue-900/20"
          >
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Initialize Mission Briefing</span>
          </button>
        </motion.div>
        
        <div className="flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <div className="flex -space-x-4">
            {[1, 2, 3].map(i => (
              <img 
                key={i}
                src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                className="w-12 h-12 rounded-2xl border-2 border-[#020617] shadow-2xl object-cover" 
                alt="Responder"
              />
            ))}
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-xs font-black text-white shadow-2xl">
              +12
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">System Online</span>
            </div>
            <span className="text-xs font-mono text-slate-500 mt-1 uppercase tracking-widest">Uptime: 99.998%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Activity} 
          label="Active Incidents" 
          value="14" 
          trend={12} 
          colorClass="bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" 
        />
        <StatCard 
          icon={ShieldAlert} 
          label="Critical Alerts" 
          value="03" 
          trend={-5} 
          colorClass="bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)]" 
        />
        <StatCard 
          icon={Users} 
          label="Responders" 
          value="156" 
          trend={8} 
          colorClass="bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]" 
        />
        <StatCard 
          icon={Zap} 
          label="AI Efficiency" 
          value="98.4%" 
          trend={2} 
          colorClass="bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 h-[600px]">
          <SovereignFeed />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Skull className="w-6 h-6 text-rose-600 dark:text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Black Hole Surveillance</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/5 border border-rose-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Tracking</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  layout
                >
                  <AlertItem 
                    type={alert.type} 
                    title={alert.title} 
                    time={alert.time} 
                    status={alert.status} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
      <button 
        onClick={() => setActiveTab('forensics')}
        className="w-full py-5 rounded-3xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:bg-slate-200 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/10 transition-all duration-300">
        Open Forensic Dossier
      </button>
        </div>
      </div>
    </div>
  );
}
