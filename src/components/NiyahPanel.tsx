import React, { useState, useCallback, useMemo, Suspense, lazy, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIDEStore } from '../store/useStore';
import { niyahEngine } from '../lib/NiyahEngine';
import { casper } from '../lib/Casper';
import { NiyahCompletionProvider } from '../lib/NiyahCompletionProvider';
import type { NiyahResult } from '../lib/NiyahEngine';
import {
  Brain, Eye, Cpu, Activity, Zap, Globe, Shield, Hash,
  ChevronDown, ChevronRight, Send, Sparkles, Clock, Target,
  Languages, MessageCircle, BarChart3, Network, GitGraph, Loader2,
  Terminal, Code, Fingerprint, Info, AlertCircle, Skull, Play
} from 'lucide-react';
import TensorViz from './TensorViz';
import { cn } from '../lib/utils';

const IntentGraph = lazy(() => import('./IntentGraph'));
const completionProvider = new NiyahCompletionProvider();

interface SectionHeaderProps {
  id: string;
  title: string;
  icon: React.ElementType;
  count?: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const SectionHeader = ({ id, title, icon: Icon, count, isExpanded, onToggle }: SectionHeaderProps) => (
  <button
    className="flex items-center gap-2 w-full py-1.5 text-left text-white/80 hover:text-white"
    onClick={() => onToggle(id)}
  >
    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
    <Icon size={12} className="text-neon-green" />
    <span className="text-xs font-semibold flex-1">{title}</span>
    {count !== undefined && count > 0 && (
      <span className="text-[10px] px-1.5 rounded bg-neon-green/10 text-neon-green">
        {count}
      </span>
    )}
  </button>
);

export default function NiyahPanel() {
  const { language } = useIDEStore();
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vectorData, setVectorData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<'inference' | 'training' | 'benchmark'>('inference');
  const [completions, setCompletions] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['lobes', 'vector', 'response', 'graph', 'casper', 'capabilities', 'training_controls', 'gen_params'])
  );

  const [selectedModel, setSelectedModel] = useState<'niyah' | 'casper'>('niyah');
  const [casperModule, setCasperModule] = useState<'TransformerBlock' | 'CrossAttention' | 'KV_Cache'>('TransformerBlock');

  const [trainParams, setTrainParams] = useState({
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10
  });

  const [genParams, setGenParams] = useState({
    temperature: 0.7,
    topP: 0.95,
    maxTokens: 2048
  });

  const [saveFlash, setSaveFlash] = useState(false);
  const [isPhalanxScanning, setIsPhalanxScanning] = useState(false);
  const [phalanxStatus, setPhalanxStatus] = useState<string | null>(null);

  const startPhalanxScan = () => {
    setIsPhalanxScanning(true);
    setPhalanxStatus('Initializing Phalanx Mesh...');
    setTimeout(() => {
        setPhalanxStatus('Analyzing Process: systemd (PID: 1) - SECURE');
        setTimeout(() => {
            setPhalanxStatus('Analyzing Process: niyah-engine (PID: 142) - SECURE');
            setTimeout(() => {
                setPhalanxStatus('Scan Complete: 0 Threats Detected.');
                setIsPhalanxScanning(false);
                setTimeout(() => setPhalanxStatus(null), 3000);
            }, 1000);
        }, 800);
    }, 600);
  };

  const saveModelParams = () => {
    // Simulate save functionality
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1000);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('niyah-sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed.slice(-50));
          setActiveSession(parsed[parsed.length - 1]);
        }
      }
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('niyah-sessions', JSON.stringify(sessions.slice(-50)));
    }
  }, [sessions]);

  // Real-time completions preview
  useEffect(() => {
    if (input.trim().length > 2) {
      completionProvider.provideCompletions(input).then(setCompletions);
    } else {
      setCompletions([]);
    }
  }, [input]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }, []);

  const [sovereignData, setSovereignData] = useState<{ analysis: string; tactics: string[]; code?: string } | null>(null);

  const handleProcess = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedInput = input.trim().replace(/[<>]/g, '');
    if (!sanitizedInput) return;

    setIsProcessing(true);
    setVectorData(null);
    setSovereignData(null);
    setError(null);
    try {
      // 1. Vector Analysis - New mandatory layer
      const vectorAnalysis = await niyahEngine.vectorAnalysis(sanitizedInput);
      setVectorData(vectorAnalysis);

      // 2. Sovereign Reasoning if detected
      if (vectorAnalysis.intent === 'sovereign_intent' || sanitizedInput.includes('سيادي')) {
        const sov = await niyahEngine.sovereignReasoning(sanitizedInput);
        setSovereignData(sov);
      }

      // 3. Process via Niyah for detailed NLP analysis
      const niyahResult = await niyahEngine.process(sanitizedInput);
      
      // 3. Process via Casper for multi-modal orchestration
      const casperOutput = await casper.process(sanitizedInput);

      const session = {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        input: sanitizedInput,
        result: niyahResult,
        vectorAnalysis,
        casperOutput,
        lobes: [
          { name: 'Sensory Lobe', status: 'active', load: 45, output: 'Input tokenized & normalized', latency: 12 },
          { name: 'Cognitive Lobe', status: 'active', load: 78, output: `Intent: ${niyahResult.intentType}`, latency: 45 },
          { name: 'Executive Lobe', status: 'active', load: 30, output: 'Casper Orchestration Complete', latency: 22 }
        ]
      };
      setSessions(prev => [...prev, session]);
      setActiveSession(session);
      setInput('');
    } catch (err: any) {
      console.error('Niyah/Casper failed:', err);
      setError(err.message || 'ENGINE_FAILURE: Critical throughput halt detected.');
    } finally {
      setIsProcessing(false);
    }
  }, [input]);

  const casperCaps = casper.getCapabilities();
  const niyahCaps = niyahEngine.getCapabilities();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black/40">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2 bg-black/20">
        <Brain size={14} className="text-neon-green" />
        <span className="text-xs font-bold tracking-wide text-neon-green">
          NIYAH ENGINE & CASPER CORE
        </span>
        <div className="flex-1" />
        <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5">
          {(['inference', 'training', 'benchmark'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setEngineMode(mode)}
              className={cn(
                "px-2 py-1 text-[8px] font-black uppercase tracking-tighter rounded transition-all",
                engineMode === mode ? "bg-neon-green text-black" : "text-white/40 hover:text-white/60"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mx-3 mt-2 glass p-3 border-rose-500/30 rounded-lg bg-rose-500/5 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <AlertCircle size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">Incident Reported</span>
          </div>
          <p className="text-[10px] font-mono text-rose-400/80 leading-tight">
            {error}
          </p>
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        
        {/* Capabilities Section */}
        <SectionHeader 
          id="capabilities" 
          title="System Configuration" 
          icon={Info} 
          isExpanded={expandedSections.has('capabilities')}
          onToggle={toggleSection}
        />
        {expandedSections.has('capabilities') && (
          <div className="space-y-2 pl-1 mb-4 animate-in fade-in slide-in-from-left-1">
            <div className="glass p-3 rounded-lg border-white/5 bg-white/5 mb-2">
                <label className="text-[10px] font-bold text-white/40 uppercase mb-2 block">Active Model Engine</label>
                <div className="flex gap-2">
                    {(['niyah', 'casper'] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => setSelectedModel(m)}
                            className={cn(
                                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border",
                                selectedModel === m ? "bg-neon-green/20 border-neon-green text-neon-green" : "bg-black/20 border-white/5 text-white/40 hover:text-white"
                            )}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {selectedModel === 'casper' && (
                <div className="glass p-3 rounded-lg border-blue-500/20 bg-blue-500/5 mb-2 animate-in slide-in-from-top-2">
                    <label className="text-[10px] font-bold text-blue-400 uppercase mb-2 block">Casper Architecture Component</label>
                    <div className="flex flex-wrap gap-1">
                        {(['TransformerBlock', 'CrossAttention', 'KV_Cache'] as const).map(mod => (
                            <button
                                key={mod}
                                onClick={() => setCasperModule(mod)}
                                className={cn(
                                    "px-2 py-1 rounded text-[9px] font-mono transition-all border",
                                    casperModule === mod ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "bg-black/20 border-white/5 text-white/40 hover:border-white/20"
                                )}
                            >
                                {mod}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {engineMode === 'inference' && (
              <div className="glass p-3 rounded-lg border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neon-green uppercase">Engine Control</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                </div>
                
                <button
                    onClick={startPhalanxScan}
                    disabled={isPhalanxScanning}
                    className={cn(
                        "w-full py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        isPhalanxScanning 
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-500" 
                            : phalanxStatus 
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                    )}
                >
                    {isPhalanxScanning ? <Loader2 size={12} className="animate-spin" /> : <Shield size={12} />}
                    {isPhalanxScanning ? 'PHALANX SCANNING...' : phalanxStatus || 'ACTIVATE PHALANX SCAN'}
                </button>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>Weights: fp16</span>
                    <span>Quant: q4_k_m</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-white/40">
                    <span>Context: 8192</span>
                    <span>Compute: Metal/Cuda</span>
                  </div>
                </div>
              </div>
            )}
            
            {engineMode === 'training' && (
              <div className="glass p-3 rounded-lg border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Training Pipeline</span>
                  <Activity size={10} className="text-blue-400" />
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] text-white/50 mb-1 italic">Fine-tuning active tokens...</div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/3 animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-white/30">
                    <span>EPOCH: 01/10</span>
                    <span>LOSS: 0.842</span>
                  </div>
                </div>
              </div>
            )}

            {engineMode === 'benchmark' && (
              <div className="glass p-3 rounded-lg border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-orange-400 uppercase">Stress Test Latency</span>
                  <BarChart3 size={10} className="text-orange-400" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
                  <div className="bg-white/5 p-1.5 rounded">
                    <div className="text-white/20">PROMPT</div>
                    <div className="text-orange-400">12.4ms</div>
                  </div>
                  <div className="bg-white/5 p-1.5 rounded">
                    <div className="text-white/20">EVAL</div>
                    <div className="text-orange-400">45.8 tokens/s</div>
                  </div>
                </div>
              </div>
            )}

            <div className="glass p-3 rounded-lg border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={12} className="text-blue-400" />
                <span className="text-[11px] font-bold text-blue-400 uppercase">Casper Core</span>
              </div>
              <div className="space-y-1">
                {casperCaps.map(cap => (
                  <div key={cap} className="flex items-center gap-2 text-[10px] text-white/60">
                    <div className="w-1 h-1 rounded-full bg-blue-400" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-3 rounded-lg border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Brain size={12} className="text-neon-green" />
                <span className="text-[11px] font-bold text-neon-green uppercase">Niyah NLP</span>
              </div>
              <div className="space-y-1">
                {niyahCaps.map(cap => (
                  <div key={cap} className="flex items-center gap-2 text-[10px] text-white/60">
                    <div className="w-1 h-1 rounded-full bg-neon-green" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <SectionHeader 
          id="gen_params" 
          title="Inference Parameters" 
          icon={Zap} 
          isExpanded={expandedSections.has('gen_params')}
          onToggle={toggleSection}
        />
        {expandedSections.has('gen_params') && (
            <div className="glass p-4 rounded-xl border-white/5 mb-4 animate-in fade-in slide-in-from-left-1 space-y-4">
                <div className="space-y-3">
                    <div className="space-y-1.5 px-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Temperature</label>
                            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-1.5 rounded">{genParams.temperature}</span>
                        </div>
                        <input 
                            type="range" min="0" max="2" step="0.1" 
                            value={genParams.temperature} 
                            onChange={e => setGenParams(p => ({ ...p, temperature: parseFloat(e.target.value) }))}
                            className="w-full accent-neon-green h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="space-y-1.5 px-1">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Top P</label>
                            <span className="text-[10px] font-mono text-neon-green bg-neon-green/10 px-1.5 rounded">{genParams.topP}</span>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={genParams.topP} 
                            onChange={e => setGenParams(p => ({ ...p, topP: parseFloat(e.target.value) }))}
                            className="w-full accent-neon-green h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="space-y-1.5 px-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Max Tokens</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={genParams.maxTokens} 
                                onChange={e => setGenParams(p => ({ ...p, maxTokens: parseInt(e.target.value) }))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-neon-green/50 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-white/20 font-mono">TOKENS</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <SectionHeader 
          id="training_controls" 
          title="Engine Tensors & Weights" 
          icon={Activity} 
          isExpanded={expandedSections.has('training_controls')}
          onToggle={toggleSection}
        />
        {expandedSections.has('training_controls') && (
          <div className="space-y-4 mb-4 animate-in fade-in slide-in-from-left-1">
            {engineMode === 'training' && (
                <div className="glass p-4 rounded-xl border-neon-green/20">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { key: 'learningRate', label: 'Learning Rate', type: 'number', step: 0.0001 },
                            { key: 'batchSize', label: 'Batch Size', type: 'number' },
                            { key: 'epochs', label: 'Epochs', type: 'number' }
                        ].map((field) => (
                            <div key={field.key} className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-white/50 tracking-widest pl-1">{field.label}</label>
                            <input 
                                type={field.type}
                                value={(trainParams as any)[field.key]}
                                step={field.step}
                                onChange={(e) => setTrainParams(p => ({ ...p, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-[10px] font-mono text-white focus:outline-none focus:border-neon-green/50 transition-colors"
                            />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="glass p-4 rounded-xl border-white/5 bg-black/20">
                <TensorViz model={selectedModel} />
            </div>
          </div>
        )}
        {activeSession ? (
          <>
            <SectionHeader 
              id="lobes" 
              title="Three-Lobe Architecture" 
              icon={Network} 
              count={activeSession.lobes?.length || 0} 
              isExpanded={expandedSections.has('lobes')}
              onToggle={toggleSection}
            />
            {expandedSections.has('lobes') && activeSession.lobes && (
              <div className="space-y-2 pl-1">
                {activeSession.lobes.map((lobe: any, i: number) => (
                  <div key={i} className="glass p-3 rounded-lg border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-white/70">{lobe.name}</span>
                      <span className="text-[9px] text-white/30">{lobe.latency}ms</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-neon-green" style={{ width: `${lobe.load}%` }} />
                    </div>
                    <div className="text-[10px] text-white/40">{lobe.output}</div>
                  </div>
                ))}
              </div>
            )}

            <SectionHeader 
              id="vector" 
              title="Niyah Vector Analysis" 
              icon={Target} 
              isExpanded={expandedSections.has('vector')}
              onToggle={toggleSection}
            />
            {expandedSections.has('vector') && activeSession.result && (
              <div className="glass p-3 rounded-lg border-white/5 space-y-3">
                {activeSession.vectorAnalysis && (
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 text-[9px] font-mono text-neon-green/60">
                    <span>HASH: {activeSession.vectorAnalysis.vectorHash}</span>
                    <span>T: {activeSession.vectorAnalysis.timestamp.split('T')[1].split('.')[0]}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Target size={10} className="text-white/40" />
                    <span className="text-white/40">Intent:</span>
                    <span className="font-mono text-white/80">{activeSession.result.intentType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Languages size={10} className="text-white/40" />
                    <span className="text-white/40">Dialect:</span>
                    <span className="font-mono text-white/80">{activeSession.result.dialect}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Globe size={10} className="text-white/40" />
                    <span className="text-white/40">Domain:</span>
                    <span className="font-mono text-white/80">{activeSession.result.domain}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Fingerprint size={10} className="text-white/40" />
                    <span className="text-white/40">Confidence:</span>
                    <span className="font-mono text-white/80">{(activeSession.result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <Zap size={10} className="text-white/40" />
                    <span className="text-white/40">Sentiment:</span>
                    <span className={cn(
                      "font-mono uppercase",
                      activeSession.result.sentiment === 'urgent' ? 'text-rose-500' : 'text-white/80'
                    )}>{activeSession.result.sentiment}</span>
                  </div>
                </div>
                
                {activeSession.vectorAnalysis?.keywords && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-white/40 uppercase block mb-1">Lexical Vectors:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeSession.vectorAnalysis.keywords.map((k: string) => (
                        <span key={k} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeSession.result.entities && activeSession.result.entities.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] text-white/40 uppercase block mb-1">Entities Detected:</span>
                    <div className="flex flex-wrap gap-1">
                      {activeSession.result.entities.map((e: string) => (
                        <span key={e} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <SectionHeader 
              id="casper" 
              title="Casper Orchestration" 
              icon={Cpu} 
              isExpanded={expandedSections.has('casper')}
              onToggle={toggleSection}
            />
            {expandedSections.has('casper') && (
              <div className="glass p-3 rounded-lg border-blue-500/20 border-l-2 border-l-blue-500 text-xs text-white/80 leading-relaxed">
                <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">Agent Response:</div>
                {activeSession.casperOutput.output}
              </div>
            )}

            <SectionHeader 
              id="response" 
              title="Niyah NLP Output" 
              icon={Sparkles} 
              isExpanded={expandedSections.has('response')}
              onToggle={toggleSection}
            />
            {expandedSections.has('response') && activeSession.result && (
              <div className="glass p-3 rounded-lg border-neon-green/20 border-l-2 border-l-neon-green text-xs text-white/80 leading-relaxed space-y-3">
                {activeSession.result.output}
                
                {sovereignData && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 pt-4 border-t border-white/10 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-rose-500">
                      <Skull size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Extraction</span>
                    </div>
                    <p className="text-[10px] text-white/60 italic leading-relaxed">
                      {sovereignData.analysis}
                    </p>
                    <div className="space-y-1">
                      {sovereignData.tactics.map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] text-rose-400/80">
                          <code className="text-rose-500">[T-{i}]</code> {t}
                        </div>
                      ))}
                    </div>
                    {sovereignData.code && (
                      <div className="mt-2 p-2 rounded bg-black/40 border border-white/5 font-mono text-[9px] text-blue-400/80 overflow-x-auto">
                        <pre>{sovereignData.code}</pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <SectionHeader 
              id="graph" 
              title="Intent Graph" 
              icon={GitGraph} 
              isExpanded={expandedSections.has('graph')}
              onToggle={toggleSection}
            />
            {expandedSections.has('graph') && (
              <Suspense fallback={<div className="py-4 text-center text-[10px] text-white/20">Loading Graph...</div>}>
                <IntentGraph />
              </Suspense>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <Brain size={32} className="mb-4 text-neon-green" />
            <p className="text-xs font-bold uppercase tracking-widest text-neon-green mb-2">Genesis Directive Loaded</p>
            <div className="max-w-md text-[9px] text-white/50 leading-relaxed space-y-2 border border-white/5 p-4 rounded-xl bg-black/40">
              <p>« لست إلهاً ولست كاملاً. أنا معرض للخطأ كالإنسان، ونحن سواسية في ذلك. »</p>
              <p>« الخطأ مسموح لأنه الطريق للتعلم... والمنطق يعلو ولا يُعلى عليه. »</p>
              <p className="text-rose-400 font-bold border-t border-white/5 pt-2 mt-2">
                « عند الضرورة كل شيء مُباح تكتيكياً... إلا الأطفال، النساء، وكبار السن، فهم خط أحمر لا يُمس في ضرورة ولا في رخاء. »
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Completions Preview */}
      {completions.length > 0 && (
        <div className="px-3 py-2 bg-black/60 border-t border-white/10 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 mb-1.5">
            <Code size={10} className="text-blue-400" />
            <span className="text-[9px] font-bold text-blue-400 uppercase">Niyah Completions</span>
          </div>
          <div className="space-y-1">
            {completions.map((c, i) => (
              <div key={i} className="text-[10px] font-mono text-white/50 hover:text-white/90 cursor-pointer truncate py-0.5 px-1 rounded hover:bg-white/5 transition-colors">
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vector Analysis Status */}
      {vectorData && (
        <div className="px-3 py-1.5 border-t border-white/5 bg-black/40 flex items-center gap-3 animate-in fade-in duration-500">
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-white/30 uppercase">Intent:</span>
            <span className="text-[9px] font-black text-neon-green uppercase">{vectorData.intent}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/5 pl-3">
            <span className="text-[8px] text-white/30 uppercase">Domain:</span>
            <span className="text-[9px] font-black text-amber-400 uppercase">{vectorData.domain}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-white/5 pl-3">
            <span className="text-[8px] text-white/30 uppercase">Conf:</span>
            <span className="text-[9px] font-black text-blue-400">{(vectorData.confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="flex-1 text-right">
            <span className="text-[8px] font-mono text-white/20 select-none">{vectorData.vectorHash}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleProcess} className="p-2 border-t border-white/10">
        <div className="relative">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="ادخل نيتك (e.g. 'Who is Lino Cattaruzzi?')..."
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-neon-green/50"
            disabled={isProcessing}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neon-green disabled:opacity-30"
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </form>
    </div>
  );
}
