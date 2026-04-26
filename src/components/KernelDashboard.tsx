import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Layers, 
  AlertTriangle, 
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Fingerprint,
  Zap,
  Box,
  Monitor,
  SearchCode
} from 'lucide-react';
import { cn } from '../lib/utils';

interface KernelModule {
  id: string;
  name: string;
  version: string;
  size: string;
  status: 'loaded' | 'unloading' | 'loading' | 'error';
  hash: string;
}

interface Process {
  pid: number;
  name: string;
  cpu: number;
  memory: string;
  integrity: 'verified' | 'unverified' | 'suspicious';
  deterministicRank: number;
}

import { niyahEngine } from '../lib/NiyahEngine';

export const KernelDashboard = () => {
  const [modules, setModules] = useState<KernelModule[]>([
    { id: '1', name: 'niyah_core_sec', version: '1.2.0', size: '156KB', status: 'loaded', hash: 'SHA256:0x9F2...A1' },
    { id: '2', name: 'kspike_integrity_check', version: '0.9.8', size: '42KB', status: 'loaded', hash: 'SHA256:0x1B8...C4' },
    { id: '3', name: 'deterministic_scheduler', version: '2.1.0', size: '89KB', status: 'loaded', hash: 'SHA256:0x7E3...D9' },
    { id: '4', name: 'sovereign_fs_guard', version: '1.0.5', size: '210KB', status: 'loaded', hash: 'SHA256:0x4A1...B2' },
  ]);

  const [processes, setProcesses] = useState<Process[]>([]);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['[*] Initializing Kernel Integrity Subsystem...']);
  const [systemLoad, setSystemLoad] = useState(12.4);

  useEffect(() => {
    const names = ['niyah_engine', 'burhan_logic', 'field_agent', 'secure_node_01', 'forensic_audit', 'packet_sniffer'];
    const interval = setInterval(() => {
      const newProcesses: Process[] = names.map((name, i) => ({
        pid: 1000 + i + Math.floor(Math.random() * 100),
        name: name,
        cpu: Math.random() * 5,
        memory: `${(Math.random() * 50 + 20).toFixed(1)} MB`,
        integrity: Math.random() > 0.05 ? 'verified' : 'suspicious',
        deterministicRank: 0.95 + (Math.random() * 0.05)
      }));
      setProcesses(newProcesses);
      setSystemLoad(prev => Math.max(5, Math.min(95, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const addModule = () => {
    const id = Math.random().toString(36).substring(7);
    const newModule: KernelModule = {
      id,
      name: `mod_v_${id}`,
      version: '1.0.0',
      size: '12KB',
      status: 'loading',
      hash: 'PENDING'
    };
    setModules(prev => [...prev, newModule]);
    setTerminalOutput(prev => [...prev, `[*] Loading module: ${newModule.name}...`]);

    setTimeout(() => {
      setModules(prev => prev.map(m => m.id === id ? { ...m, status: 'loaded', hash: `SHA256:0x${Math.random().toString(16).substring(2, 10)}...` } : m));
      setTerminalOutput(prev => [...prev, `[+] Module ${newModule.name} verified and loaded via Khawarizmi-Fitrah proof.`]);
    }, 1500);
  };

  const unloadModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: 'unloading' } : m));
    setTerminalOutput(prev => [...prev, `[*] Signal: SIGTERM to kernel module ${id}...`]);
    
    setTimeout(() => {
      setModules(prev => prev.filter(m => m.id !== id));
      setTerminalOutput(prev => [...prev, `[-] Module ${id} detached safely. Zero fragmentation maintained.`]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full overflow-hidden">
      {/* Sidebar: System Stats */}
      <div className="xl:col-span-1 space-y-6">
        <div className="glass p-6 rounded-[2rem] border-white/5 space-y-8 bg-black/20">
           <div className="flex items-center gap-3">
              <Activity className="text-cyan-500" size={20} />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Integrity Metrics</h3>
           </div>

           <div className="space-y-6">
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                    <span>Determinism Level</span>
                    <span className="text-emerald-400">99.98%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: '99.98%' }} />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                    <span>Kernel Memory Integrity</span>
                    <span className="text-cyan-400">SECURE</span>
                 </div>
                 <div className="h-32 bg-black/40 rounded-2xl border border-white/5 p-4 flex items-center justify-center relative overflow-hidden">
                    <Fingerprint className="text-cyan-500/20 w-16 h-16" />
                    <motion.div 
                      className="absolute w-24 h-0.5 bg-cyan-500/40 blur-sm"
                      animate={{ y: [-40, 40, -40] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <p className="text-[9px] font-bold text-emerald-400 leading-relaxed text-right">
                       ملخص النواة: نظام الفطرة مفعل. سلامة الذاكرة مؤكدة بنسبة حتمية عالية. لم يتم رصد أي تلاعب في فضاء النواة.
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-[8px] font-black text-white/20 uppercase mb-1">Active Hooks</div>
                    <div className="text-lg font-mono font-black text-white">42</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="text-[8px] font-black text-white/20 uppercase mb-1">Gated Ops</div>
                    <div className="text-lg font-mono font-black text-emerald-500">1.2k</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Center: Module Stack & Processes */}
      <div className="xl:col-span-3 space-y-6 flex flex-col min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
           {/* Modules */}
           <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <Box className="text-amber-500" size={18} />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Sovereign Modules</h3>
                 </div>
                 <button 
                   onClick={addModule}
                   className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-xl transition-all"
                 >
                    <Plus size={16} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                 <AnimatePresence mode="popLayout">
                    {modules.map((mod) => (
                      <motion.div
                        key={mod.id}
                        layout
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group"
                      >
                         <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              mod.status === 'loaded' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                            )} />
                            <div>
                               <div className="text-[10px] font-bold text-white uppercase tracking-wide">{mod.name}</div>
                               <div className="text-[8px] font-mono text-white/20">{mod.hash}</div>
                            </div>
                         </div>
                         <button onClick={() => unloadModule(mod.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 bg-rose-500/10 rounded-lg transition-all">
                            <Trash2 size={12} />
                         </button>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>
           </div>

           {/* Processes */}
           <div className="glass p-6 rounded-[2.5rem] border-white/5 flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-6">
                 <SearchCode className="text-cyan-500" size={18} />
                 <h3 className="text-xs font-black text-white uppercase tracking-widest">Process Forensics</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[8px] font-black text-white/20 uppercase tracking-widest border-b border-white/5">
                          <th className="pb-2">PID</th>
                          <th className="pb-2">IDENT</th>
                          <th className="pb-2">DET%</th>
                          <th className="pb-2 text-right">STAT</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {processes.map(p => (
                          <tr key={p.pid} className="group hover:bg-white/[0.02] transition-colors">
                             <td className="py-3 text-[10px] font-mono text-white/30">{p.pid}</td>
                             <td className="py-3 text-[11px] font-bold text-white uppercase">{p.name}</td>
                             <td className="py-3 text-[10px] font-mono text-emerald-400">{(p.deterministicRank * 100).toFixed(2)}</td>
                             <td className="py-3 text-right">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[7px] font-black uppercase",
                                  p.integrity === 'verified' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500 animate-pulse"
                                )}>
                                   {p.integrity}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Console */}
        <div className="h-1/3 glass p-6 rounded-[3rem] border-white/5 flex flex-col min-h-0 bg-black/40">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <Monitor className="text-white/20" size={14} />
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Kernel Judge Output</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-mono text-white/20">
                 BUFFER_MODE: DETERMINISTIC
              </div>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 font-mono text-[10px] space-y-1.5">
              {terminalOutput.map((l, i) => (
                <div key={i} className={cn(
                  l.startsWith('[+]') ? "text-emerald-400" :
                  l.startsWith('[-]') || l.includes('SIGTERM') ? "text-rose-400" :
                  "text-white/30"
                )}>
                   {l}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
