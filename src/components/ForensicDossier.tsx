import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, 
  ShieldAlert, 
  Globe, 
  Cpu, 
  Wallet, 
  Fingerprint, 
  Share2, 
  FileText, 
  Network,
  Search,
  ChevronRight,
  AlertTriangle,
  Zap,
  Activity,
  User,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface IOC {
  id: string;
  type: 'IP' | 'DOMAIN' | 'WALLET' | 'HASH';
  value: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  lastSeen: string;
  source: string;
}

interface StixObject {
  id: string;
  type: 'threat-actor' | 'malware' | 'indicator' | 'identity';
  name: string;
  description: string;
  relationships: { target: string; type: string }[];
}

export const ForensicDossier: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'iocs' | 'stix' | 'wallets'>('iocs');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated Intelligence Data for Operation Dragon403
  const [iocs] = useState<IOC[]>([
    {
      id: '1',
      type: 'WALLET',
      value: 'TRX_33_MIXER_HUB',
      threatLevel: 'critical',
      description: 'Central TRON/USDT mixer node for the Dragon403 syndicate. Identified 33 outbound wallets for laundering IAP digital assets.',
      lastSeen: '2026-04-25T14:20:00Z',
      source: 'Forensic Ledger 403'
    },
    {
      id: '2',
      type: 'IP',
      value: '33356-adm-api.48.27',
      threatLevel: 'critical',
      description: 'Tencent Cloud (AS139341) - Command server controlling the "Black Hole" 70-app network. Orchestrates device fingerprinting for IAP abuse.',
      lastSeen: '2026-04-26T01:12:00Z',
      source: 'NIYAH Strategic Feed'
    },
    {
      id: '3',
      type: 'DOMAIN',
      value: 'hilo-yalla-fraud.sg',
      threatLevel: 'high',
      description: 'Singapore-based shell entity front for IAP payment exfiltration. Linked to Yalla Live & Hilo clone networks.',
      lastSeen: '2026-04-26T03:00:00Z',
      source: 'Operation Black Hole'
    },
    {
       id: '4',
       type: 'HASH',
       value: 'SHA-CHILD-CHAT-77',
       threatLevel: 'critical',
       description: 'Malicious SDK signature used for Grooming detection evasion in Arabic voice rooms.',
       lastSeen: '2026-04-24T09:45:00Z',
       source: 'NiyahShield Lab'
    }
  ]);

  const [stixObjects] = useState<StixObject[]>([
    {
      id: 'actor-1',
      type: 'threat-actor',
      name: 'Dragon403 Syndicate',
      description: 'Sophisticated 70+ app fraudulent network targeting Saudi/GCC region via IAP exploitation.',
      relationships: [
        { target: 'malware-1', type: 'deploys' },
        { target: 'wallet-hub', type: 'withdraws_to' }
      ]
    },
    {
      id: 'malware-1',
      type: 'malware',
      name: 'PCAP- PCAP_SNIFFER_V3',
      description: 'Tactical packet sniffer identifying local bank tokens (Mada/STC Pay) for conversion to USDT.',
      relationships: []
    }
  ]);

  const filteredIocs = iocs.filter(ioc => 
    ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ioc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-700">
      {/* Forensic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <ShieldAlert className="text-blue-600 dark:text-blue-400" size={24} />
             <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
               Project DRAGON403 <span className="text-blue-600 dark:text-blue-500 opacity-50 font-normal">/ Forensic Dossier</span>
             </h2>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Fingerprint size={12} className="text-blue-500/50" />
             Sovereign Intelligence Node: Active & Synchronized
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveSegment('iocs')}
            className={cn(
              "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border",
              activeSegment === 'iocs' ? "bg-blue-600/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
            )}
          >
            Indicators (IOCs)
          </button>
          <button 
            onClick={() => setActiveSegment('stix')}
            className={cn(
              "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border",
              activeSegment === 'stix' ? "bg-blue-600/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
            )}
          >
            STIX Analysis
          </button>
          <button 
            onClick={() => setActiveSegment('wallets')}
            className={cn(
              "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border",
              activeSegment === 'wallets' ? "bg-blue-600/20 border-blue-500/40 text-blue-400" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
            )}
          >
            TRON Assets
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Intelligence List Panel */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-4 py-2 rounded-2xl">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Dossier Records..."
              className="bg-transparent border-none focus:outline-none text-xs font-mono text-slate-900 dark:text-white w-full placeholder-slate-400 dark:placeholder-slate-700"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {activeSegment === 'iocs' && filteredIocs.map((ioc, i) => (
                <motion.div
                  key={ioc.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                >
                  <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl blur-3xl opacity-5",
                    ioc.threatLevel === 'critical' ? 'from-rose-500' : 
                    ioc.threatLevel === 'high' ? 'from-orange-500' : 'from-blue-500'
                  )} />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center border",
                          ioc.type === 'WALLET' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                          ioc.type === 'IP' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' :
                          'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400'
                        )}>
                          {ioc.type === 'WALLET' && <Wallet size={18} />}
                          {ioc.type === 'IP' && <Globe size={18} />}
                          {ioc.type === 'DOMAIN' && <Network size={18} />}
                          {ioc.type === 'HASH' && <Fingerprint size={18} />}
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{ioc.type} IDENTITY</p>
                          <h3 className="text-lg font-mono font-bold text-slate-900 dark:text-white tracking-tight">{ioc.value}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">{ioc.description}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Last Synchronization</span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{new Date(ioc.lastSeen).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Verified Source</span>
                          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-500/70">{ioc.source}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Threat Classification</span>
                          <span className={cn(
                            "text-[10px] font-black uppercase flex items-center gap-1",
                            ioc.threatLevel === 'critical' ? 'text-rose-600 dark:text-rose-500' : 
                            ioc.threatLevel === 'high' ? 'text-orange-600 dark:text-orange-500' : 'text-blue-600 dark:text-blue-400'
                          )}>
                            <Zap size={10} /> {ioc.threatLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <button className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                        <Share2 size={14} />
                      </button>
                      <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {activeSegment === 'stix' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stixObjects.map((obj, i) => (
                       <motion.div
                         key={obj.id}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="p-6 bg-indigo-600/[0.03] border border-indigo-500/10 rounded-3xl space-y-4"
                       >
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded">
                              {obj.type}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{obj.name}</h4>
                             <p className="text-[11px] text-slate-600 dark:text-slate-500 leading-relaxed font-mono">{obj.description}</p>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[7px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Relationships Exported</span>
                            <div className="flex flex-wrap gap-2">
                               {obj.relationships.map((rel, idx) => (
                                 <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                                    <span className="text-[8px] text-indigo-600 dark:text-indigo-400 font-bold italic">{rel.type}</span>
                                    <ChevronRight size={10} className="text-slate-400 dark:text-white/20" />
                                    <span className="text-[8px] text-slate-500 dark:text-slate-400 font-mono">{rel.target}</span>
                                 </div>
                               ))}
                               {obj.relationships.length === 0 && <span className="text-[8px] text-slate-700 italic uppercase">Zero Nodes Connected</span>}
                            </div>
                          </div>
                       </motion.div>
                    ))}
                 </div>
              )}

              {activeSegment === 'wallets' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <AlertTriangle className="text-emerald-500 animate-pulse" size={20} />
                    <p className="text-[10px] text-emerald-500/80 font-black uppercase tracking-wider">
                      Live Blockchain Monitoring: Scanning TRON/TRX Ledger for Scam Outflows...
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Wallet size={16} className="text-emerald-400" />
                             <span className="text-[10px] font-mono text-emerald-400">TRX_SYNC_A{n}</span>
                           </div>
                           <span className="text-[10px] font-black text-white/20">#D_{Math.floor(Math.random() * 999)}</span>
                        </div>
                        <div className="py-2">
                          <p className="text-[7px] text-slate-600 uppercase tracking-widest pl-1 mb-1">Observed Amount</p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">~ {(Math.random() * 50000).toFixed(2)} <span className="text-emerald-600 dark:text-emerald-500">USDT</span></p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                           <span className="text-[8px] text-slate-500 font-bold uppercase">Transaction Hub</span>
                           <span className="text-[8px] text-emerald-500/50 font-mono">AUTHORIZED_NODE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-6 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-3xl space-y-6">
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">Intelligence Statistics</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Total Critical IOCs</p>
                    <p className="text-xl font-black text-rose-600 dark:text-rose-500">248</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Tracked Wallets</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">1,403</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Active Actors</p>
                    <p className="text-xl font-black text-blue-600 dark:text-blue-400">12</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase">Google Play Exploits</p>
                    <p className="text-xl font-black text-orange-600 dark:text-orange-400">5</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">Active Protocols</h3>
               <div className="space-y-2">
                 {[
                   { name: 'Operation Dragon403', status: 'In-Progress', color: 'blue' },
                   { name: 'Yalla Live Forensic', status: 'Gathering', color: 'indigo' },
                   { name: 'Hilo IAP Analysis', status: 'Locked', color: 'emerald' },
                   { name: 'STIX Sync Core', status: 'Running', color: 'blue' }
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white/[0.05] dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-white/70">{p.name}</span>
                      <span className={cn(
                        "text-[7px] font-black uppercase px-2 py-0.5 rounded border",
                        p.color === 'blue' ? 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10' :
                        p.color === 'indigo' ? 'border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' :
                        'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      )}>{p.status}</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl space-y-3">
               <div className="flex items-center gap-2">
                 <Zap className="text-blue-600 dark:text-blue-400 animate-pulse" size={14} />
                 <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Niyah Engine Insight</span>
               </div>
               <p className="text-[10px] text-blue-800 dark:text-blue-300/80 leading-relaxed italic">
                 "Artificial intelligence has identified a repetitive pattern in IAP rejection tokens linked to the Dragon403 syndicate. Advise monitoring cross-border TRX withdrawals."
               </p>
            </div>
          </div>
          
          <div className="p-6 bg-[#00ffc8]/5 border border-[#00ffc8]/20 rounded-3xl flex flex-col items-center gap-3 text-center">
            <Activity className="text-emerald-600 dark:text-[#00ffc8] animate-pulse" size={32} />
            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Real-Time Threat Streaming</h4>
            <p className="text-[9px] text-emerald-600/60 dark:text-[#00ffc8]/60 uppercase tracking-widest leading-relaxed">
              Synchronized with Sovereign Intelligence Network Nodes. Updates arriving every 120ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicDossier;
