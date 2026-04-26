import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Box, Zap, Activity, Info, ShieldCheck, SearchCode, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { niyahEngine } from '../lib/NiyahEngine';
import { kSpike, EvidenceLedger } from '../lib/KSPIKEEngine';
import { useStore } from '../store/useStore';

export const KSpikeTUI = () => {
  const [logs, setLogs] = useState<string[]>([
    '[*] KSpike Interactive Console v4.0.0 (Sovereign Ops)',
    '[*] Connected to Niyah-LOBE-RPC (HAVEN Node 0x92)',
    '[*] Initializing TUI layers...',
    '[+] Ready. Type "help" to list available taps and modules.'
  ]);
  const [input, setInput] = useState('');
  const [activeTaps, setActiveTaps] = useState<string[]>(['kspike-procfs', 'kspike-auth-log']);
  const [isVerifying, setIsVerifying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setLogs(prev => [...prev, `kspike@sovereign:~$ ${input}`]);
    setInput('');

    if (cmd === 'help') {
      setLogs(prev => [...prev, 
        'Available Taps:',
        '  - kspike-procfs: Monitor /proc and TCP connections',
        '  - kspike-auth-log: Analyze authentication logs',
        '  - kspike-ebpf-lsm: LSM Hooks (Experimental)',
        'Commands:',
        '  - modules: List all loaded modules',
        '  - verify <path>: Run Evidence Ledger verification',
        '  - signals: Show active signals from taps',
        '  - clear: Clear the console'
      ]);
      return;
    }

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    if (cmd === 'modules') {
      setLogs(prev => [...prev, 
        'Listing Loaded Modules Configuration:',
        'NAME                VERSION     STATUS          DESCRIPTION',
        '--------------------------------------------------------------------------------',
        ...Object.entries(kSpike.taps).map(([name, tap]) => 
          `${name.padEnd(20)} ${tap.version.padEnd(10)} ${tap.status.toUpperCase().padEnd(15)} ${tap.description.substring(0, 40)}...`
        )
      ]);
      return;
    }

    if (cmd.startsWith('load')) {
      const name = cmd.split(' ')[1];
      if (!name) {
        setLogs(prev => [...prev, '[-] Usage: load <tap_name>']);
        return;
      }
      const result = kSpike.load_tap(name);
      setLogs(prev => [...prev, result.success ? `[+] ${result.message}` : `[-] ${result.message}`]);
      if (result.success) setActiveTaps(prev => [...new Set([...prev, name])]);
      return;
    }

    if (cmd.startsWith('unload')) {
      const name = cmd.split(' ')[1];
      if (!name) {
        setLogs(prev => [...prev, '[-] Usage: unload <tap_name>']);
        return;
      }
      const result = kSpike.unload_tap(name);
      setLogs(prev => [...prev, result.success ? `[+] ${result.message}` : `[-] ${result.message}`]);
      if (result.success) setActiveTaps(prev => prev.filter(t => t !== name));
      return;
    }

    if (cmd === 'signals') {
      const signals = [
        'UNLINKED_PROC: Hidden process attempt detected in pid=1337',
        'SSH_ABUSE: 42 failed login attempts from 185.x.x.x',
        'LSM_DENIAL: Access denied to /etc/shadow for non-root user "niyah_dev"'
      ];
      
      for (const s of signals) {
        setLogs(prev => [...prev, `[SIGNAL] ${s}`]);
        const explanation = await niyahEngine.explainJudgeRuling('Generic Ruling', s.split(':')[0]);
        setLogs(prev => [...prev, `[NIYAH-AR] ${explanation.arabic}`]);
      }
      return;
    }

    if (cmd.startsWith('verify')) {
      const parts = cmd.split(' ');
      const path = parts[1] || 'evidence_v1.ledger';
      const signature = parts[2] || 'sig_ed25519_verified_by_niyah';
      
      setIsVerifying(true);
      const result = await EvidenceLedger.verify_file(path, signature, ['hash_a', 'hash_b', 'hash_c']);
      setLogs(prev => [...prev, ...result.auditLog]);
      setIsVerifying(false);
      return;
    }

    setLogs(prev => [...prev, `[-] Unknown command: ${cmd}`]);
  };

  return (
    <div className="flex flex-col gap-6 h-full p-8 bg-slate-100/40 dark:bg-[#050505]/40 border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden transition-colors">
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Terminal className="text-emerald-500" size={20} />
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">KSpike Interactive TUI</h3>
        </div>
        <div className="flex gap-4">
          {activeTaps.map(tap => (
            <div key={tap} className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono text-emerald-500 uppercase font-black">{tap}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Console */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 bg-white/60 dark:bg-black/60 rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-2 transition-colors"
          >
            {logs.map((log, i) => (
              <div key={i} className={cn(
                log.startsWith('kspike@') ? "text-cyan-600 dark:text-cyan-400" :
                log.startsWith('[+]') ? "text-emerald-600 dark:text-emerald-400" :
                log.startsWith('[-]') ? "text-rose-600 dark:text-rose-500" :
                log.startsWith('[NIYAH-AR]') ? "text-amber-600 dark:text-amber-400 font-bold" :
                log.startsWith('[SIGNAL]') ? "text-rose-600 dark:text-rose-400" :
                "text-slate-500 dark:text-white/40"
              )}>
                {log}
              </div>
            ))}
            {isVerifying && <motion.p animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }} className="text-slate-400 dark:text-white/30">[Verifying Cryptographic Chain...]</motion.p>}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-4 bg-slate-200/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-4 rounded-3xl transition-colors">
            <span className="text-emerald-500 font-black text-[11px] ml-4 font-mono">kspike@sovereign:~$</span>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none text-[11px] font-mono text-slate-900 dark:text-white outline-none focus:ring-0"
              placeholder="Execute tap, verify file, or list modules..."
              autoFocus
            />
          </form>
        </div>

        {/* Sidebar Status */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="p-6 bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-4 shadow-sm dark:shadow-none">
             <div className="flex items-center gap-2">
                <Box size={14} className="text-cyan-500" />
                <span className="text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Active Tap Data</span>
             </div>
             <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5">
                   <div className="text-[8px] font-black text-emerald-500 uppercase mb-1">kspike-procfs</div>
                   <div className="text-[10px] font-mono text-slate-600 dark:text-white/40 truncate">/proc/1337/exe (HIDDEN)</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5">
                   <div className="text-[8px] font-black text-cyan-500 uppercase mb-1">kspike-ebpf-lsm</div>
                   <div className="text-[10px] font-mono text-slate-600 dark:text-white/40">SYSCALL_OPEN denied: /etc/shadow</div>
                </div>
             </div>
          </div>

          <div className="flex-1 p-6 bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-6 shadow-sm dark:shadow-none">
             <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Evidence Vault</span>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                   <div className="flex justify-between text-[8px] font-black text-slate-400 dark:text-white/20 uppercase">
                      <span>Chain Integrity</span>
                      <span className="text-emerald-500">100%</span>
                   </div>
                   <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full" />
                   </div>
                </div>
                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center">
                   <p className="text-[9px] text-emerald-600 dark:text-emerald-500/60 uppercase font-black tracking-widest">Ed25519 Verified</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
