import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Skull, 
  Target, 
  Terminal as TerminalIcon, 
  Zap, 
  ShieldAlert, 
  Code2, 
  Activity,
  Maximize2,
  ChevronRight,
  Radio,
  Cpu,
  Search,
  Filter,
  AlertTriangle,
  Send,
  Boxes,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Globe,
  MapPin,
  Users,
  Database,
  Layers,
  Fingerprint,
  Eye,
  Shield,
  Share2,
  Lock,
  Briefcase,
  BarChart3,
  Rocket,
  ShieldCheck,
  SearchCode,
  FileWarning,
  Network
} from 'lucide-react';
import { cn } from '../lib/utils';
import { niyahEngine } from '../lib/NiyahEngine';
import { msfKernel } from '../lib/MSFKernel';
import msfData from '../data/msf_modules.json';
import intelligenceData from '../data/intelligence.json';
import { PhalanxGuardian } from './PhalanxGuardian';
import { KForgeSync } from './KForgeSync';
import NiyahTrainingPanel from './NiyahTrainingPanel';
import { KernelDashboard } from './KernelDashboard';
import ExploitScanner from './ExploitScanner';
import { TTSControl } from './TTSControl';
import TensorViz from './TensorViz';
import KSPIKEPanel from './KSPIKEPanel';
import { KSpikeTUI } from './KSpikeTUI';

interface ExploitModule {
  path: string;
  name: string;
  type: string;
  category: string;
  platform: string;
  rank: string;
}

export const KSpike = () => {
  const [moduleParams, setModuleParams] = useState({
    rhosts: '192.168.1.1',
    lhost: '10.0.0.5',
    lport: '4444',
    payload: 'windows/x64/meterpreter/reverse_tcp',
    exitfunc: 'thread'
  });
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [kerberoastParams, setKerberoastParams] = useState({
    rhosts: '',
    domain: '',
    userFile: 'users.txt',
    passFile: 'passwords.txt'
  });
  const [activeTab, setActiveTab] = useState<'modules' | 'audit' | 'kernel' | 'niyah' | 'tts' | 'forensics' | 'kerberoast' | 'tui'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [consoleInput, setConsoleInput] = useState('');
  const [tacticalObjective, setTacticalObjective] = useState('');
  const [auditParams, setAuditParams] = useState({
    target: '36.97.126.139',
    mode: 'Standard',
    depth: 'Deep'
  });
  const [isScanning, setIsScanning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '[*] K-SPIKE Initializing...',
    '[*] Loading Sovereign MSF database...',
    `[+] ${msfData.modules.length} tactical modules imported from NIYAH local storage.`,
    '[*] Waiting for target specification...'
  ]);
  const [selectedModule, setSelectedModule] = useState<ExploitModule | null>(null);
  const upgradeSuggestions = useMemo(() => msfKernel.getUpgradeIntelligence(), []);

  const filteredModules = useMemo(() => {
    return msfData.modules.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^[a-zA-Z0-9_]*$/.test(value)) {
      setSearchError("Only alphanumeric characters and underscores allowed.");
    } else {
      setSearchError(null);
      setSearchQuery(value);
    }
  };
  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;

    if (consoleInput.trim().toLowerCase() === 'clear') {
      setTerminalOutput([]);
      setConsoleInput('');
      return;
    }

    setTerminalOutput(prev => [...prev, `msf > ${consoleInput}`]);
    const result = msfKernel.handleCommand(consoleInput);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, ...result.output]);
      if (result.sessionOpened) {
        setActiveSession('1');
      }
    }, 200);

    setConsoleInput('');
  };

  const handleExecute = () => {
    if (!selectedModule) return;
    
    setTerminalOutput(prev => [...prev, `[*] Triggering ${selectedModule.path}...`]);
    
    // Simulated sequence for real-world code logic
    setTimeout(() => setTerminalOutput(prev => [...prev, `[*] Payload Construction: windows/x64/meterpreter/reverse_tcp`]), 400);
    setTimeout(() => setTerminalOutput(prev => [...prev, `[*] Fragmentation Level: HIGH (Bypassing EDR)`]), 800);
    setTimeout(() => setTerminalOutput(prev => [...prev, `[*] Sending exploit stage...`]), 1200);
    setTimeout(() => setTerminalOutput(prev => [...prev, `[+] Stage delivered. Waiting for callback...`]), 2000);
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, `[!] METERPRETER SESSION OPENED (127.0.0.1:4444)`]);
      setActiveSession('1');
    }, 3500);
  };

  const suggestModule = () => {
    if (!tacticalObjective) return;
    setTerminalOutput(prev => [...prev, `[*] Analyzing objective: "${tacticalObjective}"`]);
    
    const result = niyahEngine.analyzeRedTeamTarget(tacticalObjective);

    setTimeout(() => {
      setTerminalOutput(prev => [...prev, `[+] ${result.tacticalBrief}`]);
      if (result.suggestedModules.length > 0) {
        setSelectedModule(result.suggestedModules[0]);
        setActiveTab('modules');
      }
    }, 800);
  };

  const runKerberoast = () => {
    setIsScanning(true);
    setTerminalOutput(prev => [
      ...prev, 
      `[*] Initiating Kerberoasting operation on ${kerberoastParams.domain || 'LOCAL_DOMAIN'}...`,
      `[*] Target: ${kerberoastParams.rhosts || '127.0.0.1'}`,
      `[*] Configuration: USER_FILE=${kerberoastParams.userFile}, PASS_FILE=${kerberoastParams.passFile}`
    ]);

    setTimeout(() => {
      const result = msfKernel.handleCommand('use auxiliary/gather/get_user_spns');
      setTerminalOutput(prev => [...prev, ...result.output]);
      
      setTimeout(() => {
        const runResult = msfKernel.handleCommand(`run RHOSTS=${kerberoastParams.rhosts}`);
        setTerminalOutput(prev => [...prev, ...runResult.output]);
        setIsScanning(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] text-white p-6 gap-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <Cpu className="text-cyan-500" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">K-SPIKE ENGINE</h1>
            <p className="text-[10px] font-mono text-[#00ffc8] uppercase tracking-[0.2em]">
              <span className="opacity-40">Kernel-Integrated</span> Sovereign Integrity & Deterministic Engine
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center bg-white/5 rounded-xl p-1 overflow-x-auto">
          <button 
                onClick={() => setActiveTab('kernel')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'kernel' ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Kernel Integrity
              </button>
              <button 
                onClick={() => setActiveTab('audit')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'audit' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Security Audit
              </button>
              <button 
                onClick={() => setActiveTab('tts')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'tts' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Vocal Synthesis
              </button>
              <button 
                onClick={() => setActiveTab('forensics')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'forensics' ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Forensic Ops
              </button>
              <button 
                onClick={() => setActiveTab('tui')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'tui' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Interactive TUI
              </button>
              <button 
                onClick={() => setActiveTab('niyah')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'niyah' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Niyah Training
              </button>
              <button 
                onClick={() => setActiveTab('kerberoast')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === 'kerberoast' ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-white/40 hover:text-white"
                )}
              >
                Kerberoast
              </button>
        </div>

        <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTerminalOutput(prev => [...prev, '[*] Initiating K-SPIKE Core Evolution...', '[+] Bypassing legacy binaries...', '[+] Injecting MSF v6.4 logic directly into NIYAH-LOBE-B...', '[!] EVOLUTION COMPLETE: K-SPIKE is now the Core Layer.'])}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ffc8]/10 border border-[#00ffc8]/20 hover:bg-[#00ffc8]/20 transition-all group"
            >
              <Cpu size={14} className="text-[#00ffc8] group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-mono text-[#00ffc8] font-bold uppercase">Upgrade Kernel</span>
            </motion.button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
                <span className="text-[10px] font-mono text-white/40 uppercase">Modules:</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{msfData.modules.length}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
                <Activity size={14} className="text-rose-500 animate-pulse" />
                <span className="text-[10px] font-mono text-rose-500 font-bold uppercase">Red Team Active</span>
            </div>
        </div>
      </div>

        {/* Right Side: Tab View Content */}
        <div className="col-span-12 flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'kernel' ? (
              <motion.div 
                key="kernel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full overflow-hidden"
              >
                <KernelDashboard />
              </motion.div>
            ) : activeTab === 'audit' ? (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <ExploitScanner />
              </motion.div>
            ) : activeTab === 'tts' ? (
              <motion.div 
                key="tts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full"
              >
                <TTSControl initialText={terminalOutput.join('\n')} />
              </motion.div>
            ) : activeTab === 'forensics' ? (
              <motion.div key="forensics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full"><KSPIKEPanel /></motion.div>
            ) : activeTab === 'tui' ? (
              <motion.div key="tui" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full"><KSpikeTUI /></motion.div>
            ) : activeTab === 'niyah' ? (
              <motion.div key="niyah" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full"><NiyahTrainingPanel /></motion.div>
            ) : activeTab === 'kerberoast' ? (
              <motion.div 
                key="kerberoast"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <div className="flex flex-col gap-6 p-8 bg-orange-500/5 border border-orange-500/10 rounded-[32px] h-full overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Zap className="text-orange-500" size={16} />
                    </div>
                    <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Kerberoast Configuration</h3>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-2">Target RHOSTS</label>
                      <input 
                        type="text"
                        value={kerberoastParams.rhosts}
                        onChange={(e) => setKerberoastParams(prev => ({ ...prev, rhosts: e.target.value }))}
                        placeholder="172.16.1.10"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono focus:border-orange-500/50 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-2">AD Domain</label>
                      <input 
                        type="text"
                        value={kerberoastParams.domain}
                        onChange={(e) => setKerberoastParams(prev => ({ ...prev, domain: e.target.value }))}
                        placeholder="Sovereign.local"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono focus:border-orange-500/50 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-2">User List</label>
                        <input 
                          type="text"
                          value={kerberoastParams.userFile}
                          onChange={(e) => setKerberoastParams(prev => ({ ...prev, userFile: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-mono focus:border-orange-500/50 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-2">Password List</label>
                        <input 
                          type="text"
                          value={kerberoastParams.passFile}
                          onChange={(e) => setKerberoastParams(prev => ({ ...prev, passFile: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-mono focus:border-orange-500/50 outline-none"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={runKerberoast}
                      disabled={isScanning}
                      className="mt-4 w-full py-4 rounded-2xl bg-orange-500 text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-400 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                      {isScanning ? 'Scanning Network...' : 'Launch Kerberoast Attack'}
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                    <p className="text-[10px] text-white/40 leading-relaxed font-mono italic">
                      Kerberoasting targets Active Directory service accounts by requesting TGS tickets and cracking them offline. This module automates the extraction and prepares hashes for the NIYAH-CRACK-CLUSTER.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-[8px] font-bold text-white/20 uppercase mb-1">Stealth</div>
                            <div className="text-[10px] font-mono text-emerald-400">HIGH</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-[8px] font-bold text-white/20 uppercase mb-1">Complexity</div>
                            <div className="text-[10px] font-mono text-orange-400">MED</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                            <div className="text-[8px] font-bold text-white/20 uppercase mb-1">Impact</div>
                            <div className="text-[10px] font-mono text-rose-400">CRITICAL</div>
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
                {/* Default Modules View (Left Side) */}
                <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
                  <div className="flex flex-col gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-[24px] flex-1 overflow-hidden">
                    <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input 
                            type="text"
                            placeholder="Seek Integrity Modules..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={cn(
                              "w-full bg-black border rounded-xl py-3 pl-10 pr-4 text-xs font-mono placeholder:text-white/20 transition-all outline-none",
                              searchError ? "border-rose-500 focus:border-rose-500" : "border-white/10 focus:border-cyan-500/50"
                            )}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {filteredModules.map((mod) => (
                        <button
                          key={mod.path}
                          onClick={() => setSelectedModule(mod)}
                          className={cn(
                            "w-full p-4 rounded-2xl border transition-all text-left",
                            selectedModule?.path === mod.path 
                              ? "bg-cyan-500/10 border-cyan-500/40" 
                              : "bg-white/[0.02] border-white/10 hover:border-white/20"
                          )}
                        >
                          <div className="text-[11px] font-mono text-white/80">{mod.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Default Modules View (Right Side: Workstation) */}
                <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
                  {/* Workstation */}
                  <div className="h-2/3 bg-white/[0.01] border border-white/5 rounded-[32px] overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 right-12 p-6 flex gap-3 z-20">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5 backdrop-blur-md">
                            <div className={cn("w-1.5 h-1.5 rounded-full", activeSession ? "bg-emerald-500 animate-pulse" : "bg-white/10")} />
                            <span className="text-[10px] font-mono text-white/60">Sessions: {activeSession ? 1 : 0}</span>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 p-6 z-20">
                      <Maximize2 size={16} className="text-white/20 hover:text-white transition-colors cursor-pointer" />
                    </div>
                    
                    <div className="p-10 flex flex-col justify-center h-full max-w-2xl mx-auto w-full">
                      {selectedModule ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Boxes className="text-rose-500" size={18} />
                                <h2 className="text-3xl font-bold tracking-tight">{selectedModule.name}</h2>
                            </div>
                            <p className="text-[11px] font-mono text-white/40">{selectedModule.path}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[24px] hover:border-white/10 transition-colors">
                              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-3">RHOSTS</label>
                              <input 
                                type="text" 
                                value={moduleParams.rhosts}
                                onChange={(e) => setModuleParams(p => ({ ...p, rhosts: e.target.value }))}
                                placeholder="192.168.1.1" 
                                className="w-full bg-transparent border-none text-sm font-mono focus:ring-0 p-0 text-white font-medium"
                              />
                            </div>
                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-[24px] hover:border-white/10 transition-colors">
                              <label className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-3">PAYLOAD</label>
                              <input 
                                type="text" 
                                value={moduleParams.payload}
                                onChange={(e) => setModuleParams(p => ({ ...p, payload: e.target.value }))}
                                className="w-full bg-transparent border-none text-sm font-mono focus:ring-0 p-0 text-white font-medium"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[20px]">
                              <label className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-2">LHOST</label>
                              <input 
                                type="text" 
                                value={moduleParams.lhost}
                                onChange={(e) => setModuleParams(p => ({ ...p, lhost: e.target.value }))}
                                className="w-full bg-transparent border-none text-[11px] font-mono focus:ring-0 p-0 text-white"
                              />
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[20px]">
                              <label className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-2">LPORT</label>
                              <input 
                                type="text" 
                                value={moduleParams.lport}
                                onChange={(e) => setModuleParams(p => ({ ...p, lport: e.target.value }))}
                                className="w-full bg-transparent border-none text-[11px] font-mono focus:ring-0 p-0 text-white"
                              />
                            </div>
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[20px]">
                              <label className="text-[8px] font-bold text-white/30 uppercase tracking-widest block mb-2">EXITFUNC</label>
                              <input 
                                type="text" 
                                value={moduleParams.exitfunc}
                                onChange={(e) => setModuleParams(p => ({ ...p, exitfunc: e.target.value }))}
                                className="w-full bg-transparent border-none text-[11px] font-mono focus:ring-0 p-0 text-white"
                              />
                            </div>
                          </div>

                          <div className="flex gap-6">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] text-white/50">
                                <Zap size={14} className="text-amber-500" />
                                Rank: <span className="text-emerald-400 font-bold uppercase">{selectedModule.rank}</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] text-white/50">
                                <Cpu size={14} className="text-blue-500" />
                                Target: <span className="text-blue-400 font-bold uppercase">{selectedModule.platform}</span>
                            </div>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExecute}
                            className="group relative w-full py-6 rounded-[24px] bg-rose-500 text-white font-black uppercase tracking-[0.4em] text-[14px] shadow-2xl shadow-rose-500/30 hover:bg-rose-400 active:bg-rose-600 transition-all flex items-center justify-center gap-3 overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                            <Radio size={20} className="animate-pulse" />
                            Engage Target
                          </motion.button>
                        </div>
                      ) : (
                        <div className="text-center space-y-6 opacity-40">
                          <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto">
                            <Target className="text-white/20" size={40} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-1">Awaiting Tactical Selection</h3>
                            <p className="text-xs font-mono text-white/60">Module configuration and deployment authorized.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Backdrop Glow */}
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />
                  </div>

                  {/* Terminal */}
                  <div className="h-1/3 bg-black border border-white/5 rounded-[32px] p-8 font-mono overflow-hidden flex flex-col shadow-2xl">
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <TerminalIcon size={14} className="text-rose-500" />
                            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">K-SPIKE OUTPUT CONSOLE</span>
                        </div>
                        <div className="flex items-center gap-4 text-[9px] text-white/20">
                            <span>BAUD: 115200</span>
                            <span>PROTO: RSA-2048</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-4">
                      {terminalOutput.map((line, i) => (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i} 
                            className={cn(
                          "text-[10px] leading-relaxed",
                          line.startsWith('msf >') ? "text-white font-bold" :
                          line.startsWith('[+]') ? "text-emerald-400 font-bold" :
                          line.startsWith('[*]') ? "text-blue-400/80" :
                          line.startsWith('[!]') ? "text-rose-500 font-black animate-pulse" :
                          line.startsWith('[-]') ? "text-rose-400 font-medium" : "text-white/60"
                        )}
                        >
                          <span className="text-white/15 mr-3 w-8 inline-block select-none">{String(i+1).padStart(3, '0')}</span>
                          {line}
                        </motion.div>
                      ))}
                    </div>

                    {/* Console Input */}
                    <form onSubmit={handleConsoleSubmit} className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">
                        <span className="text-rose-500 font-bold text-xs">msf &gt;</span>
                        <input 
                            type="text"
                            value={consoleInput}
                            onChange={(e) => setConsoleInput(e.target.value)}
                            placeholder="Enter command (use, set, exploit, help)..."
                            className="flex-1 bg-transparent border-none text-[10px] font-mono text-white focus:ring-0 p-0 placeholder:text-white/10"
                            autoFocus
                        />
                    </form>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};
