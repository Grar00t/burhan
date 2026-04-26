import React, { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import { useIDEStore } from '../store/useStore';
import { cn } from '../lib/utils';
import {
  Brain, Cpu, Activity, Zap, Globe, Shield, Hash,
  ChevronDown, ChevronRight, Send, Sparkles, Clock, Target,
  Languages, MessageCircle, BarChart3, Network, GitGraph, Loader2,
} from 'lucide-react';

import MediaLab from './MediaLab';
import TensorViz from './TensorViz';

const NiyahPanel = lazy(() => import('./NiyahPanel'));
const NiyahTrainingPanel = lazy(() => import('./NiyahTrainingPanel'));
const NiyahBenchmark = lazy(() => import('./NiyahBenchmark'));
const MSFPanel = lazy(() => import('./MSFPanel'));
const GrandDinner = lazy(() => import('./GrandDinner'));

export function AIEngine() {
  const { activeTab, niyahMode, setNiyahMode } = useIDEStore();
  const [activeEngine, setActiveEngine] = useState<'niyah' | 'casper' | 'phalanx'>('niyah');
  const [casperModule, setCasperModule] = useState<'TransformerBlock' | 'CrossAttention' | 'KV_Cache'>('TransformerBlock');

  return (
    <div className="h-full flex flex-col bg-black/40 border-l border-white/10">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10">
        <button
          onClick={() => setActiveEngine('niyah')}
          className={`flex-1 py-2 text-[10px] font-black tracking-[0.2em] transition-all uppercase ${
            activeEngine === 'niyah' ? 'text-neon-green border-b border-neon-green bg-neon-green/5' : 'text-slate-500 dark:text-white/40 hover:text-slate-800'
          }`}
        >
          Sensory Lobe
        </button>
        <button
          onClick={() => setActiveEngine('casper')}
          className={`flex-1 py-2 text-[10px] font-black tracking-[0.2em] transition-all uppercase ${
            activeEngine === 'casper' ? 'text-neon-blue border-b border-neon-blue bg-neon-blue/5' : 'text-slate-500 dark:text-white/40 hover:text-slate-800'
          }`}
        >
          Executive Lobe
        </button>
        <button
          onClick={() => setActiveEngine('phalanx')}
          className={`flex-1 py-2 text-[10px] font-black tracking-[0.2em] transition-all uppercase ${
            activeEngine === 'phalanx' ? 'text-neon-red border-b border-neon-red bg-neon-red/5' : 'text-slate-500 dark:text-white/40 hover:text-slate-800'
          }`}
        >
          Cognitive Lobe
        </button>
      </div>

    <div className="flex-1 overflow-y-auto">
        <Suspense fallback={<div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-white/20 uppercase tracking-widest">Loading Engine...</div>}>
          {activeEngine === 'niyah' && (
            <div className="h-full flex flex-col uppercase">
               <div className="flex bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 p-1 gap-1">
                <button
                    onClick={() => setNiyahMode('inference')}
                    className={cn(
                    "flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                    niyahMode === 'inference' ? "bg-neon-green text-black" : "text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5"
                    )}
                >
                    Inference
                </button>
                <button
                    onClick={() => setNiyahMode('training')}
                    className={cn(
                    "flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                    niyahMode === 'training' ? "bg-neon-green text-black" : "text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5"
                    )}
                >
                    Training
                </button>
                <button
                    onClick={() => setNiyahMode('benchmark')}
                    className={cn(
                    "flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                    niyahMode === 'benchmark' ? "bg-neon-green text-black" : "text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5"
                    )}
                >
                    Bench
                </button>
                <button
                    onClick={() => setNiyahMode('msf')}
                    className={cn(
                    "flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                    niyahMode === 'msf' ? "bg-rose-500 text-white" : "text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5"
                    )}
                >
                    MSF
                </button>
                <button
                    onClick={() => setNiyahMode('dinner')}
                    className={cn(
                    "flex-1 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all",
                    niyahMode === 'dinner' ? "bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.5)]" : "text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5"
                    )}
                >
                    Sovereign Records
                </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    {niyahMode === 'inference' ? <NiyahPanel /> : 
                    niyahMode === 'training' ? <NiyahTrainingPanel /> :
                    niyahMode === 'benchmark' ? <NiyahBenchmark /> :
                    niyahMode === 'msf' ? <MSFPanel /> :
                    <GrandDinner />}
                </div>
            </div>
          )}
          {activeEngine === 'casper' && (
            <div className="h-full flex flex-col p-4 space-y-6">
                <div className="flex items-center gap-3">
                    <Zap size={20} className="text-neon-blue" />
                    <div>
                        <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Casper Core Configuration</h2>
                        <p className="text-[10px] text-slate-500 dark:text-white/40 uppercase">Multi-modal Orchestration Layer</p>
                    </div>
                </div>

                <div className="glass p-4 rounded-xl border-blue-500/20 bg-blue-500/5">
                    <label className="text-[10px] font-black text-blue-400 uppercase mb-3 block tracking-widest">Casper Layer Selection</label>
                    <div className="grid grid-cols-1 gap-2">
                        {(['TransformerBlock', 'CrossAttention', 'KV_Cache'] as const).map(mod => (
                            <button
                                key={mod}
                                onClick={() => setCasperModule(mod)}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-[10px] font-mono text-left transition-all border flex items-center justify-between",
                                    casperModule === mod ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "bg-black/40 border-white/5 text-white/40 hover:border-white/20"
                                )}
                            >
                                <span>{mod}</span>
                                {casperModule === mod && <Activity size={12} className="animate-pulse" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="glass p-4 rounded-xl border-white/5 bg-black/20">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Weight Tensor Map</span>
                    </div>
                    <TensorViz model="casper" />
                </div>
            </div>
          )}
          {activeEngine === 'phalanx' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-40">
              <Shield size={32} className="mb-4 text-neon-red" />
              <p className="text-xs font-bold uppercase tracking-widest">PHALANX GUARD</p>
              <p className="text-[10px] mt-4 leading-relaxed max-w-xs uppercase font-mono">
                Real-time threat detection and forensic analysis. Monitoring process integrity and network sovereignty. 
                <br /><br />
                STATUS: [WATCHING]
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
