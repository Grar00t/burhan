import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Activity, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Network,
  Fingerprint,
  ChevronRight,
  Database,
  Search,
  Eye,
  ShieldAlert,
  Target,
  Skull
} from 'lucide-react';
import { cn } from '../lib/utils';

interface KernelSignal {
  id: string;
  ts: string;
  source: string;
  kind: string;
  actor: string;
  threat: 'Low' | 'Medium' | 'High' | 'Hostile';
  confidence: number;
  data: any;
}

interface EvidenceRecord {
  seq: number;
  ts: string;
  category: 'signal' | 'verdict' | 'judge' | 'strike' | 'defense';
  module: string;
  payload: string;
  hash: string;
}

export const KSpikeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'ledger' | 'modules' | 'judge'>('monitor');
  const [phiValue, setPhiValue] = useState(0.88); // KHZ Balance Φ
  const [isKernelActive, setIsKernelActive] = useState(true);

  const [signals, setSignals] = useState<KernelSignal[]>([
    {
      id: 'sig-1',
      ts: new Date().toISOString(),
      source: 'XDP_BURP',
      kind: 'http.log4shell_jndi',
      actor: '198.51.100.99',
      threat: 'Hostile',
      confidence: 0.98,
      data: { payload: 'jndi:ldap://...' }
    },
    {
      id: 'sig-2',
      ts: new Date(Date.now() - 5000).toISOString(),
      source: 'LSM_TAP',
      kind: 'file_open_shadow',
      actor: 'bin/bash',
      threat: 'High',
      confidence: 0.92,
      data: { path: '/etc/shadow' }
    },
    {
      id: 'sig-3',
      ts: new Date(Date.now() - 15000).toISOString(),
      source: 'auth.log',
      kind: 'ssh.auth.fail.burst',
      actor: '45.132.22.12',
      threat: 'Medium',
      confidence: 0.85,
      data: { attempts: 42 }
    }
  ]);

  const [ledger, setLedger] = useState<EvidenceRecord[]>([
    {
      seq: 142,
      ts: new Date().toISOString(),
      category: 'strike',
      module: 'striker.net.meterpreter_sinkhole',
      payload: 'DNAT redirected to Honeypot A-403',
      hash: 'Blake3:4f8e...e932'
    },
    {
      seq: 141,
      ts: new Date(Date.now() - 10000).toISOString(),
      category: 'judge',
      module: 'CasperJudge',
      payload: 'Authorized active response: Φ=0.88 clears floor.',
      hash: 'Blake3:a2f1...b3e8'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhiValue(prev => {
        const change = (Math.random() - 0.5) * 0.05;
        return Math.min(Math.max(prev + change, 0.4), 0.98);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const moduleLibrary = [
    { name: 'detector.ssh_bruteforce', type: 'detector', risk: 0, purpose: 'Reports high-velocity SSH auth failures.' },
    { name: 'defender.ssh_quarantine', type: 'defender', risk: 1, purpose: 'Drops an actor into the nftables quarantine set.' },
    { name: 'striker.net.meterpreter_sinkhole', type: 'striker', risk: 7, purpose: 'DNATs confirmed Meterpreter flows into a local honeypot.' },
    { name: 'detector.smb.eternalblue_probe', type: 'detector', risk: 2, purpose: 'NT_TRANS probe shape on the wire detector.' },
    { name: 'defender.kernel_lockdown', type: 'defender', risk: 3, purpose: 'Raises kernel lockdown on rootkit suspicion.' },
    { name: 'striker.c2_burn', type: 'striker', risk: 8, purpose: 'Null-routes and DNS-sinks a confirmed C2.' },
  ];

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-black/40 border border-[#00ffc8]/20 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#00ffc8] shadow-[0_0_20px_rgba(0,255,200,0.4)]" />
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#00ffc8]/5 rounded-[24px] border border-[#00ffc8]/20 relative group">
            <ShieldAlert className="text-[#00ffc8] group-hover:scale-110 transition-transform" size={40} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ffc8] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,200,1)]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                K<span className="text-[#00ffc8]">SPIKE</span> v1.0
              </h2>
              <span className="px-3 py-1 bg-[#00ffc8]/10 text-[#00ffc8] text-[9px] font-black uppercase tracking-widest rounded-full border border-[#00ffc8]/30">
                Sovereign Stack
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] flex items-center gap-2">
              <Cpu size={12} className="text-[#00ffc8]/50" />
              Dual-Mode Kernel Defense · Casper Governed
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {['monitor', 'ledger', 'modules', 'judge'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border",
                activeTab === tab 
                  ? "bg-[#00ffc8]/10 border-[#00ffc8]/40 text-[#00ffc8] shadow-[0_0_15px_rgba(0,255,200,0.1)]" 
                  : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Main Interface */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'monitor' && (
              <motion.div 
                key="monitor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col gap-6"
              >
                {/* Visualizer / Heatmap Area */}
                <div className="h-48 glass rounded-[32px] border-white/5 relative overflow-hidden p-8 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-[#00ffc8] uppercase tracking-widest">eBPF Data Plane</span>
                    <h3 className="text-2xl font-black text-white italic">XDP_BURP ACTIVE</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 font-black uppercase">PPS</span>
                        <span className="text-xl font-mono text-white">42.8k</span>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 font-black uppercase">Dropped</span>
                        <span className="text-xl font-mono text-[#00ffc8]">1,403</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-sm h-12 flex items-end gap-1 px-8">
                    {[...Array(20)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${Math.random() * 100}%` }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-[#00ffc8] to-transparent opacity-20 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Signals Table */}
                <div className="flex-1 glass rounded-[32px] border-white/5 p-6 flex flex-col gap-4 overflow-hidden">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Kernel Signals (Live)</h4>
                    <span className="flex items-center gap-2 text-[9px] font-black text-[#00ffc8] uppercase">
                       <Activity size={10} className="animate-pulse" />
                       Real-time Intake
                    </span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                    {signals.map((sig, i) => (
                      <motion.div 
                        key={sig.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center border",
                              sig.threat === 'Hostile' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                              sig.threat === 'High' ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                              "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            )}>
                              <Zap size={18} />
                            </div>
                            <div>
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{sig.source} // {sig.kind}</p>
                               <h5 className="text-sm font-mono font-bold text-white">{sig.actor}</h5>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Confidence</p>
                              <p className="text-xs font-mono text-white">{(sig.confidence * 100).toFixed(0)}%</p>
                            </div>
                            <div className="h-10 w-px bg-white/5" />
                            <div className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border",
                              sig.threat === 'Hostile' ? "bg-rose-500/10 border-rose-500/40 text-rose-500" : "bg-white/5 border-white/10 text-slate-400"
                            )}>
                              {sig.threat}
                            </div>
                            <button className="p-2 text-slate-600 hover:text-white transition-colors">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ledger' && (
              <motion.div 
                key="ledger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 glass rounded-[32px] border-white/5 p-8 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between mb-2">
                   <div>
                     <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Evidence Ledger</h3>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Blake3 Signed Hash Chain</p>
                   </div>
                   <Fingerprint size={32} className="text-[#00ffc8] opacity-20" />
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                  {ledger.map((record) => (
                    <div key={record.seq} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#00ffc8] flex items-center gap-2">
                            <History size={14} /> #{record.seq}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            record.category === 'strike' ? "bg-rose-500/20 text-rose-500" :
                            record.category === 'judge' ? "bg-amber-500/20 text-amber-500" :
                            "bg-blue-500/20 text-blue-400"
                          )}>
                            {record.category}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600">{new Date(record.ts).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm font-black text-white italic mb-3">"{record.payload}"</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Signature Verified // RSA4096</span>
                        <span className="text-[9px] font-mono text-[#00ffc8]/40 truncate max-w-[200px]">{record.hash}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'modules' && (
              <motion.div 
                key="modules"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 glass rounded-[32px] border-white/5 p-8 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2">
                   {moduleLibrary.map((mod) => (
                     <div key={mod.name} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl group">
                       <div className="flex items-center justify-between mb-3">
                         <span className={cn(
                           "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                           mod.type === 'striker' ? "bg-rose-500/20 text-rose-500" :
                           mod.type === 'defender' ? "bg-blue-500/20 text-blue-400" :
                           "bg-emerald-500/20 text-emerald-400"
                         )}>
                           {mod.type}
                         </span>
                         <span className="text-[9px] font-mono text-slate-600">Risk: {mod.risk}</span>
                       </div>
                       <h5 className="text-xs font-bold text-white mb-2">{mod.name}</h5>
                       <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">{mod.purpose}</p>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'judge' && (
              <motion.div 
                key="judge"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col gap-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* The Four Conditions */}
                  <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col gap-6">
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Judge ROE Charter</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Certainty (يقين)', desc: 'Evidenced attack in progress', status: 'verified' },
                        { label: 'Exhaustion (استنفاد)', desc: 'Defenders unable to contain', status: 'verified' },
                        { label: 'Legitimacy (مشروعية)', desc: 'Direct target is identified actor', status: 'verified' },
                        { label: 'Proportion (تناسب)', desc: 'Commensurate with threat level', status: 'pending' },
                      ].map((cond) => (
                        <div key={cond.label} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
                          <div>
                            <p className="text-[10px] font-black text-white tracking-widest uppercase mb-1">{cond.label}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{cond.desc}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border",
                            cond.status === 'verified' ? "bg-[#00ffc8]/10 border-[#00ffc8]/30 text-[#00ffc8]" : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          )}>
                             {cond.status === 'verified' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KHZ_Q Balancer Dashboard */}
                  <div className="glass p-8 rounded-[40px] border-white/5 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-900/10 to-transparent">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] opacity-40" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">KHZ_Q Protocol Balance</span>
                      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="96" cy="96" r="88" className="stroke-white/5 fill-none" strokeWidth="8" />
                          <motion.circle 
                            cx="96" cy="96" r="88" 
                            className="stroke-blue-500 fill-none" 
                            strokeWidth="8" 
                            strokeDasharray="552"
                            initial={{ strokeDashoffset: 552 }}
                            animate={{ strokeDashoffset: 552 - (552 * phiValue) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">Φ Score</span>
                           <span className="text-5xl font-black text-white italic tracking-tighter">{phiValue.toFixed(2)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                        Authorized: Striker modules ready for lawful deployment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arabic Explainability - kspike-niyah */}
                <div className="glass p-8 rounded-[40px] border-[#00ffc8]/10 bg-[#00ffc8]/5 relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-6">
                    <Shield className="text-[#00ffc8]" size={24} />
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">NIYAH Governance Explanation</h3>
                  </div>
                  <div className="space-y-6">
                     <p className="text-xl font-bold text-[#00ffc8]/90 leading-relaxed text-right font-sans" dir="rtl">
                       "القرار: تم اكتشاف محاولة حقن JNDI في الذاكرة الحية. بناءً على مبدأ (الإنسان أولاً)، تقرر عزل النطاق 198.51.100.99 فوراً. القرار عادل، متناسب، ومسجل في السجل السيادي."
                     </p>
                     <div className="h-px bg-white/5 w-full" />
                     <p className="text-xs text-slate-500 italic leading-relaxed">
                       "Decision: JNDI injection detected in live memory. Per the 'Human First' principle, domain 198.51.100.99 has been isolated. The action is just, proportionate, and sealed in the sovereign ledger."
                     </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Status Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-8 rounded-[40px] border-white/5 space-y-8 h-full">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pb-2 border-b border-white/5">System Status</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Kernel Engine', value: 'NOMINAL', icon: Cpu, color: '#00ffc8' },
                   { label: 'XDP Burp', value: 'FILTERING', icon: Network, color: '#3b82f6' },
                   { label: 'Sovereign Bridge', value: 'LOCKED', icon: Lock, color: '#00ffc8' },
                   { label: 'Evidence Chain', value: 'SIGNED', icon: Fingerprint, color: '#3b82f6' },
                 ].map((stat) => (
                   <div key={stat.label} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <stat.icon size={14} style={{ color: stat.color }} />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                     </div>
                     <span className="text-[10px] font-black text-white uppercase tracking-tighter">{stat.value}</span>
                   </div>
                 ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pb-2 border-b border-white/5">Module Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Detectors Active</p>
                    <p className="text-2xl font-black text-white tabular-nums">12</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Strikes Authorized</p>
                    <p className="text-2xl font-black text-rose-500 tabular-nums">04</p>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-[32px] space-y-4">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">K-FORGE SYNC</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Receiving community IOCs... node_403_riyadh connected via encrypted gossip.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[8px] text-blue-500/60 font-black uppercase tracking-widest italic">14 Peers Linked</span>
              </div>
            </div>
            
            <button className="w-full py-4 rounded-2xl bg-[#00ffc8] text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#00d1a3] transition-colors flex items-center justify-center gap-2 mt-auto shadow-[0_0_20px_rgba(0,255,200,0.2)]">
              <Zap size={14} /> Emergency Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KSpikeDashboard;
