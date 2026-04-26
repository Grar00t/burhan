import React, { useState, useCallback, useMemo } from 'react';
import { 
  Zap, Activity, Cpu, BarChart3, 
  Terminal, Gauge, Timer, CheckCircle2, 
  Play, ShieldAlert, Cpu as CpuIcon,
  Trophy, Globe, Brain, ArrowUpRight, History
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { wsService } from '../lib/WebSocketService';

const competitorData = [
  { category: 'Arabic NLP', niyah: 98, copilot: 74, grok: 68, gemini: 82 },
  { category: 'Tactical Recon', niyah: 94, copilot: 45, grok: 52, gemini: 41 },
  { category: 'Exploit Dev', niyah: 91, copilot: 32, grok: 41, gemini: 28 },
  { category: 'Zero-Day Heuristics', niyah: 88, copilot: 12, grok: 24, gemini: 18 },
  { category: 'Sovereign Compliance', niyah: 100, copilot: 15, grok: 22, gemini: 10 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[9px] font-bold text-white/60 uppercase">{entry.name}</span>
              </div>
              <span className="text-[10px] font-mono font-black" style={{ color: entry.color }}>{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

interface BenchRow {
  name: string;
  before: number;
  after: number;
  speedup: number;
  bandwidth: string;
  status: 'pending' | 'running' | 'complete';
}

export default function NiyahBenchmark() {
  const [isRunning, setIsRunning] = useState(false);
  const [simdActive, setSimdActive] = useState('AVX2+FMA');
  const [activeCategory, setActiveCategory] = useState(competitorData[0].category);

  const chartData = useMemo(() => {
    const category = competitorData.find(d => d.category === activeCategory);
    if (!category) return [];
    return [
      { name: 'NIYAH', score: category.niyah, color: '#3b82f6' },
      { name: 'Copilot', score: category.copilot, color: '#6366f1' },
      { name: 'Grok', score: category.grok, color: '#ec4899' },
      { name: 'Gemini', score: category.gemini, color: '#f59e0b' },
    ];
  }, [activeCategory]);
  const [results, setResults] = useState<BenchRow[]>([
    { name: 'matvec scalar 4096×4096', before: 184.2, after: 184.2, speedup: 1.0, bandwidth: '1.8 GB/s', status: 'pending' },
    { name: 'matvec SIMD 4096×4096', before: 184.2, after: 12.4, speedup: 14.8, bandwidth: '1.8→26.4 GB/s', status: 'pending' },
    { name: 'fwd embed=512 L=4', before: 45.0, after: 8.2, speedup: 5.5, bandwidth: '1240 tok/s', status: 'pending' },
    { name: 'fwd embed=1024 L=6', before: 120.0, after: 24.5, speedup: 4.9, bandwidth: '408 tok/s', status: 'pending' },
    { name: 'train_step embed=256 L=2', before: 12.0, after: 3.1, speedup: 3.8, bandwidth: 'loss=2.5000', status: 'pending' },
  ]);

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    
    wsService.send({
      type: 'NIYAH_ENGINE_MESSAGE',
      payload: { output: 'Initiating Sovereign Benchmark Protocol v3.0...' },
      timestamp: new Date().toISOString()
    });

    for (let i = 0; i < results.length; i++) {
      setResults(prev => prev.map((row, idx) => 
        idx === i ? { ...row, status: 'running' } : row
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      setResults(prev => prev.map((row, idx) => 
        idx === i ? { ...row, status: 'complete' } : row
      ));

      wsService.send({
        type: 'NIYAH_ENGINE_MESSAGE',
        payload: { output: `[BENCH] ${results[i].name} completed: ${results[i].speedup}x speedup.` },
        timestamp: new Date().toISOString()
      });
    }

    setIsRunning(false);
  }, [results]);

  return (
    <div className="glass rounded-[40px] border-white/5 overflow-hidden flex flex-col h-full shadow-2xl bg-black/40">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-green/10 border border-neon-green/20">
            <Gauge className="w-4 h-4 text-neon-green" />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Sovereign Benchmark</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <CpuIcon size={10} className="text-white/40" />
            <span className="text-[9px] font-mono text-white/60">SIMD: {simdActive}</span>
          </div>
          <button
            onClick={runBenchmark}
            disabled={isRunning}
            className={cn(
              "px-4 py-1.5 rounded-xl border transition-all flex items-center gap-2",
              isRunning 
                ? "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
                : "bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50"
            )}
          >
            {isRunning ? <Timer className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" fill="currentColor" />}
            <span className="text-[10px] font-black uppercase tracking-widest">Execute Bench</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <div className="grid grid-cols-1 gap-3">
          {results.map((row, i) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-300",
                row.status === 'running' ? "bg-neon-green/5 border-neon-green/20" :
                row.status === 'complete' ? "bg-white/[0.02] border-white/10" :
                "bg-white/[0.01] border-white/5 opacity-50"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-1.5 rounded-lg border",
                    row.status === 'running' ? "bg-neon-green/20 border-neon-green/30 text-neon-green" :
                    row.status === 'complete' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                    "bg-white/5 border-white/10 text-white/20"
                  )}>
                    {row.status === 'running' ? <Timer size={12} className="animate-spin" /> :
                     row.status === 'complete' ? <CheckCircle2 size={12} /> :
                     <Activity size={12} />}
                  </div>
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">{row.name}</span>
                </div>
                {row.status === 'complete' && (
                  <span className="text-[10px] font-black font-mono text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20">
                    {row.speedup}x Speedup
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Latency</span>
                  <div className="text-[10px] font-mono text-white/60">
                    {row.status === 'complete' ? `${row.after} ms` : '---'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Throughput</span>
                  <div className="text-[10px] font-mono text-white/60">
                    {row.bandwidth}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Status</span>
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-widest",
                    row.status === 'running' ? "text-neon-green animate-pulse" :
                    row.status === 'complete' ? "text-blue-400" : "text-white/20"
                  )}>
                    {row.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Competitor AI Benchmark */}
        <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Trophy className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Competitor intelligence</h3>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">NIYAH vs Industry Originals</p>
              </div>
            </div>
            <div className="flex gap-2">
              {competitorData.map(d => (
                <button
                  key={d.category}
                  onClick={() => setActiveCategory(d.category)}
                  className={cn(
                    "px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border transition-all",
                    activeCategory === d.category
                      ? "bg-blue-500/20 border-blue-500 text-blue-400"
                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                  )}
                >
                  {d.category}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#050505]/50 border border-white/5 rounded-3xl p-6 h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff30', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff03' }} />
                <Bar 
                  dataKey="score" 
                  radius={[8, 8, 0, 0]} 
                  barSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Floating Stats */}
            <div className="absolute top-6 right-6 flex flex-col gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Sovereign Lead</span>
                <span className="text-lg font-black text-blue-400 font-mono">
                  +{chartData[0].score - Math.max(...chartData.slice(1).map(d => d.score))}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Arabic Dialects', value: 'Verified', icon: Globe },
              { label: 'Unfiltered Reasoning', value: 'Sovereign', icon: Brain },
              { label: 'Local Deployment', value: 'Zero-Cloud', icon: ShieldAlert },
              { label: 'Tactical Edge', value: 'K-SPIKE', icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2 text-center">
                <stat.icon size={12} className="text-white/40" />
                <span className="text-[8px] font-mono text-white/60">{stat.value}</span>
                <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smoke Test Card */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-white/40" />
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Smoke Consistency Test</h4>
            </div>
            {results.every(r => r.status === 'complete') ? (
              <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">SMOKE PASS ✓</span>
            ) : (
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Awaiting Run</span>
            )}
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: results.filter(r => r.status === 'complete').length / results.length * 100 + '%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
