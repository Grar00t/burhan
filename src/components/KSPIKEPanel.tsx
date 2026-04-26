import React, { useState, useEffect, useRef } from 'react';
import { kSpike, ForensicResult } from '../lib/KSPIKEEngine';
import { niyahEngine } from '../lib/NiyahEngine';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  Globe, 
  Database, 
  Fingerprint, 
  Activity,
  Zap,
  Code2,
  FileSearch,
  Server,
  Network,
  Cpu,
  Brain,
  ImageIcon,
  Eye,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import NetworkGraph from './NetworkGraph';
import { createWorker } from 'tesseract.js';
import Markdown from 'react-markdown';

const SAMPLE_SMALI = `
.class public Lcom/fraud/app/Config;
.super Ljava/lang/Object;

.field public static final API_KEY:Ljava/lang/String; = "AKIA_DRAGON403_X92J_SECRET"
.field public static final ENDPOINT:Ljava/lang/String; = "https://api.v1.secure-gate.io/v2/log"
.field public static final DATABASE:Ljava/lang/String; = "central-recon-403.local-node.internal"

.method public static getSecrets()V
    .registers 1
    const-string v0, "167.172.102.55"
    return-void
.end method
`;

export default function KSPIKEPanel() {
  const { language } = useStore();
  const [activeTab, setActiveTab] = useState<'forensics' | 'intelligence' | 'graph' | 'terminal'>('forensics');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ForensicResult | null>(null);
  const [reconDomain, setReconDomain] = useState('secure-gate.io');
  const [reconResult, setReconResult] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runForensicScan = async () => {
    setIsScanning(true);
    addLog('Initiating Deep Forensic Scan (K-SPIKE Core)...');
    
    // Simulate scan
    await new Promise(r => setTimeout(r, 1500));
    const result = await kSpike.scanSource('Config.smali', SAMPLE_SMALI);
    
    // Enrich with intelligence and mapping
    addLog('Enriching forensic artifacts with threat feeds (AlienVault)...');
    const enriched = await kSpike.enrichWithThreatIntel(result);
    
    // AI Processing
    addLog('Synthesizing sovereign intelligence report (Niyah Engine)...');
    const summary = await niyahEngine.processForensicIntelligence(enriched);
    enriched.aiSummary = summary;

    setScanResult(enriched);
    setIsScanning(false);
    addLog(`Scan complete. Critical risk artifacts identified.`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    addLog(`Received forensic asset: ${file.name}`);

    try {
      if (file.type.startsWith('image/')) {
        addLog('Asset identified as image. Initializing OCR engine (Tesseract)...');
        const worker = await createWorker('eng');
        
        const { data: { text } } = await worker.recognize(file);
        await worker.terminate();

        addLog('Extraction complete. Running analysis on OCR text...');
        const result = await kSpike.scanSource(file.name, text);
        const enriched = await kSpike.enrichWithThreatIntel(result);
        const summary = await niyahEngine.processForensicIntelligence(enriched);
        enriched.aiSummary = summary;
        
        setScanResult(enriched);
      } else {
        addLog('Processing text/code asset...');
        const text = await file.text();
        const result = await kSpike.scanSource(file.name, text);
        const enriched = await kSpike.enrichWithThreatIntel(result);
        const summary = await niyahEngine.processForensicIntelligence(enriched);
        enriched.aiSummary = summary;
        setScanResult(enriched);
      }
    } catch (error) {
      addLog(`Extraction failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    setIsScanning(false);
    addLog('Forensic extraction finished.');
  };

  const runIntelligenceRecon = async () => {
    setIsScanning(true);
    addLog(`Running Infrastructure Recon for: ${reconDomain}`);
    await new Promise(r => setTimeout(r, 2000));
    const result = await kSpike.performRecon(reconDomain);
    setReconResult(result);
    setIsScanning(false);
    addLog('Recon complete. Domain infrastructure mapped.');
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 font-sans">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
            <ShieldAlert size={20} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">K-SPIKE Forensic Engine</h2>
            <p className="text-[10px] text-orange-400/60 uppercase font-mono tracking-tighter">Sovereign Investigation Unit // KHAWRIZM</p>
          </div>
        </div>
        <div className="flex gap-1 h-8 bg-black/40 p-1 rounded-lg border border-white/5">
          {[
            { id: 'forensics', icon: FileSearch, label: 'Forensics' },
            { id: 'intelligence', icon: Globe, label: 'Intel' },
            { id: 'graph', icon: Network, label: 'Node Graph' },
            { id: 'terminal', icon: Terminal, label: 'Console' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                activeTab === tab.id ? "bg-orange-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <tab.icon size={12} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'forensics' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Input / OCR Upload */}
                <div className="space-y-4">
                  <div className="glass p-4 rounded-xl border-white/5 bg-black/40 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <Code2 size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Forensic Entry</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/60 rounded text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2"
                        >
                          <ImageIcon size={12} />
                          Upload Asset
                        </button>
                        <button 
                          onClick={runForensicScan}
                          disabled={isScanning}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                        >
                          {isScanning ? <Activity size={12} className="animate-pulse" /> : <Zap size={12} />}
                          Quick Scan
                        </button>
                      </div>
                    </div>
                    {isScanning && (
                      <div className="h-[200px] flex flex-col items-center justify-center gap-3 bg-white/[0.01] rounded-lg">
                        <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                        <span className="text-[10px] font-mono text-orange-400 animate-pulse">EXTRACTING_TELEMETRY...</span>
                      </div>
                    )}
                    {!isScanning && (
                      <pre className="text-[11px] font-mono leading-relaxed text-blue-300/80 p-2 overflow-auto max-h-[300px]">
                        {SAMPLE_SMALI}
                      </pre>
                    )}
                  </div>

                  {/* AI Summary Section */}
                  {scanResult?.aiSummary && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass p-6 rounded-xl border-emerald-500/30 bg-emerald-500/5 space-y-3"
                    >
                      <div className="flex items-center gap-3 text-emerald-400 border-b border-emerald-500/10 pb-2">
                        <Brain size={16} />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Sovereign Intelligence Report</span>
                      </div>
                      <div className="markdown-body text-[11px] leading-relaxed opacity-80 prose prose-invert max-w-none">
                        <Markdown>{scanResult.aiSummary}</Markdown>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Analysis Results */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 px-2">
                      <Fingerprint size={16} className="text-orange-400" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Enriched Artifacts</h4>
                   </div>
                   
                   {!scanResult ? (
                     <div className="h-[300px] border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 italic text-[11px]">
                       Awaiting forensic telemetry...
                     </div>
                   ) : (
                     <div className="space-y-3">
                        {scanResult.matches.map((m, i) => (
                          <motion.div 
                            key={i}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={cn(
                              "p-3 bg-white/[0.02] border rounded-lg group transition-all",
                              m.threatInfo?.reputation === 'MALICIOUS' ? "border-rose-500/30 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.1)]" : "border-white/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex gap-2">
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                  m.type === 'SECRET' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                                )}>
                                  {m.type}
                                </span>
                                {m.threatInfo?.reputation === 'MALICIOUS' && (
                                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-600 text-white text-[8px] font-black uppercase italic">
                                    <ShieldAlert size={8} /> MALICIOUS
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] font-mono text-white/20">CONFIDENCE: {(m.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="text-[11px] font-mono text-orange-400 mb-1 truncate">{m.value}</div>
                            {m.threatInfo && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {m.threatInfo.tags.map((tag, ti) => (
                                  <span key={ti} className="text-[8px] bg-black/40 text-white/40 px-1 rounded border border-white/5">{tag}</span>
                                ))}
                                <div className="text-[8px] text-white/20 ml-auto font-mono">FEED: {m.threatInfo.source}</div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'intelligence' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-xl border-white/5 bg-black/40 max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input 
                      type="text"
                      value={reconDomain}
                      onChange={e => setReconDomain(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2 text-xs font-mono text-orange-400 focus:border-orange-500/50 outline-none"
                      placeholder="Enter Target Domain..."
                    />
                  </div>
                  <button 
                    onClick={runIntelligenceRecon}
                    disabled={isScanning}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
                  >
                    Analyze
                  </button>
                </div>

                {reconResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Server size={14} className="text-blue-400" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">DNS Telemetry</span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(reconResult.records).map(([key, vals]: any) => (
                           <div key={key} className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-white/20">{key}:</span>
                              <span className="text-blue-400">{vals[0]}</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <ShieldAlert size={14} className="text-orange-400" />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Security Gaps</span>
                      </div>
                      <div className="space-y-1.5">
                        {reconResult.infrastructureGaps.map((gap: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-[9px] text-orange-200/60 bg-orange-500/5 p-1.5 rounded">
                            <span className="text-orange-500 shrink-0">•</span>
                            {gap}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'graph' && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="h-[600px] flex flex-col space-y-4"
            >
               <div className="flex items-center gap-2 px-2">
                  <Network size={16} className="text-cyan-400" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Infrastructure & Discovery Map</h4>
               </div>
               <div className="flex-1">
                {scanResult?.networkNodes ? (
                  <NetworkGraph nodes={scanResult.networkNodes} links={scanResult.networkLinks || []} />
                ) : (
                  <div className="h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-600 italic text-[11px]">
                    Map telemetry not available. Run a scan first.
                  </div>
                )}
               </div>
            </motion.div>
          )}

          {activeTab === 'terminal' && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-[11px] h-[400px] overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-auto space-y-1 scrollbar-hide">
                <div className="text-orange-400 font-bold mb-2">K-SPIKE v4.0.0 (Forensic Edition)</div>
                <div className="text-slate-500 mb-4 uppercase text-[9px] tracking-widest">System Ready. Establishing Sovereign Link...</div>
                {logs.map((log, i) => (
                  <div key={i} className="text-slate-300">
                    <span className="text-orange-500/50 mr-2">»</span>
                    {log}
                  </div>
                ))}
                {isScanning && <div className="text-blue-400 animate-pulse">Running analysis vectors... [TASK_ID: 0x88F2]</div>}
              </div>
              <div className="border-t border-white/5 pt-3 mt-3 flex items-center gap-3">
                <span className="text-orange-500 font-black">NIYAH@K-SPIKE:~$</span>
                <input 
                  type="text" 
                  className="bg-transparent border-none outline-none text-white w-full"
                  placeholder="Enter command (scan, recon, logs)..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const cmd = (e.target as HTMLInputElement).value;
                      addLog(`Executing: ${cmd}`);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
        <div className="flex gap-4">
          <span className="text-orange-500/50">ENGINE: K-SPIKE_CORE</span>
          <span>LOCATION: RIYADH_DC</span>
          <span className="flex items-center gap-1.5">
            WATHQ_STATUS: 
            <span className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              useStore.getState().wathqApiKey ? "bg-emerald-500" : "bg-rose-500"
            )} />
            {useStore.getState().wathqApiKey ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-emerald-500" />
          SECURE CONNECTION ACTIVE
        </div>
      </div>
    </div>
  );
}
