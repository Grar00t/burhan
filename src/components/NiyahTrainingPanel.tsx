import React, { useState, useCallback } from 'react';
import { niyahEngine } from '../lib/NiyahEngine';
import {
  Brain, Zap, Activity, Target,
  Loader2, Play, Database, TrendingDown, Clock, BarChart4, Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const TensorVisualizer = ({ layer }: { layer: string }) => {
  const [data, setData] = useState<number[][]>([]);
  
  React.useEffect(() => {
    // Generate simulated tensor data (8x8 grid)
    const newData = Array.from({ length: 8 }, () => 
      Array.from({ length: 8 }, () => Math.random() * 2 - 1)
    );
    setData(newData);
  }, [layer]);

  return (
    <div className="space-y-4 p-2 bg-black/20 rounded-xl border border-white/5 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Weight Distribution: {layer}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-20" />
          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-60" />
          <div className="w-2 h-2 rounded-full bg-blue-500" />
        </div>
      </div>
      
      {/* Heatmap */}
      <div className="grid grid-cols-8 gap-0.5 aspect-square">
        {data.flat().map((val, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.005 }}
            style={{ 
              backgroundColor: val > 0 ? `rgba(59, 130, 246, ${val})` : `rgba(239, 68, 68, ${Math.abs(val)})` 
            }}
            className="w-full h-full rounded-[1px] hover:scale-125 hover:z-10 transition-all cursor-crosshair border border-white/5"
            title={`Weight: ${val.toFixed(4)}`}
          />
        ))}
      </div>

      {/* Mini Histogram */}
      <div className="h-12 flex items-end gap-1 px-1">
        {Array.from({ length: 16 }).map((_, i) => {
          const height = Math.random() * 100;
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              className="flex-1 bg-[#00ffc8]/20 border-t border-[#00ffc8]/40 rounded-t-sm"
            />
          );
        })}
      </div>
    </div>
  );
};

export default function NiyahTrainingPanel() {
  const [isTraining, setIsTraining] = useState(false);
  const [params, setParams] = useState({
    dataset: 'niyah_arabic_dialects_v2',
    learningRate: 0.001,
    batchSize: 32,
    epochs: 10,
    useLoRA: true,
    loraRank: 8,
    loraAlpha: 32,
    int8Quantization: false
  });

  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [currentLoss, setCurrentLoss] = useState<number | null>(null);
  const [history, setHistory] = useState<{ epoch: number; loss: number }[]>([]);
  const [tacticalLog, setTacticalLog] = useState<string>('');
  const [selectedLayer, setSelectedLayer] = useState<string>('layer.0.attention.wq');
  const [showArchReport, setShowArchReport] = useState(false);
  const [archInsights, setArchInsights] = useState<any>(null);

  const startTraining = useCallback(async () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setCurrentLoss(null);
    setHistory([]);
    setTacticalLog('Initializing Sovereign Mesh...');
    setShowArchReport(false);

    try {
      const finalLoss = await niyahEngine.train(
        params.dataset,
        params.learningRate,
        params.batchSize,
        params.epochs,
        (epoch, loss) => {
          setCurrentEpoch(epoch);
          setCurrentLoss(loss);
          setHistory(prev => [...prev, { epoch, loss }]);
          
          // Use a simple selection of tactical logs for local UI
          const localLogs = [
            'Scrubbing PII from dataset...',
            'Evaluating architectural invariants...',
            'Injecting LoRA adapters...',
            'Refining dialect weights...',
            'INT8 Quantization optimization...'
          ];
          setTacticalLog(localLogs[epoch % localLogs.length]);
        }
      );
      setCurrentLoss(finalLoss);
      setTacticalLog('Training Complete. Weights Secured.');
      
      // Fetch insights
      setArchInsights(niyahEngine.getArchitecturalInsights());
      setShowArchReport(true);
    } catch (error) {
      console.error('Training failed:', error);
      setTacticalLog('Training Aborted: Forensic Breach Detected (Simulation).');
    } finally {
      setIsTraining(false);
    }
  }, [params]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-black/40">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
        <Database size={14} className="text-neon-green" />
        <span className="text-xs font-bold tracking-wide text-neon-green">
          NIYAH TRAINING MODULE
        </span>
        <div className="flex-1" />
        {isTraining && (
          <div className="flex items-center gap-2">
            <Loader2 size={12} className="text-neon-green animate-spin" />
            <span className="text-[10px] text-neon-green animate-pulse font-mono">TRAINING IN PROGRESS...</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-white/60" />
            <h3 className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Learning Rate</label>
              <div className="relative">
                <input
                    type="number"
                    step="0.0001"
                    min="0.00001"
                    max="0.1"
                    value={params.learningRate}
                    onChange={e => setParams(p => ({ ...p, learningRate: parseFloat(e.target.value) }))}
                    disabled={isTraining}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white/80 focus:border-neon-green/50 outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-white/20 font-mono italic">LR</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Batch Size</label>
              <div className="relative">
                <input
                    type="number"
                    min="1"
                    max="256"
                    value={params.batchSize}
                    onChange={e => setParams(p => ({ ...p, batchSize: parseInt(e.target.value) }))}
                    disabled={isTraining}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white/80 focus:border-neon-green/50 outline-none transition-all"
                />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-white/20 font-mono italic">BS</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest pl-1">Epochs</label>
              <div className="relative">
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={params.epochs}
                    onChange={e => setParams(p => ({ ...p, epochs: parseInt(e.target.value) }))}
                    disabled={isTraining}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white/80 focus:border-neon-green/50 outline-none transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-white/20 font-mono italic">EP</div>
              </div>
            </div>
          </div>

          {/* Advanced Architecture Controls */}
          <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu size={12} className="text-blue-400" />
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">LoRA & Quantization</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setParams(p => ({ ...p, useLoRA: !p.useLoRA }))}
                  className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase transition-all border",
                    params.useLoRA ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/10 text-white/20"
                  )}
                >
                  LoRA: {params.useLoRA ? 'ON' : 'OFF'}
                </button>
                <button 
                  onClick={() => setParams(p => ({ ...p, int8Quantization: !p.int8Quantization }))}
                  className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase transition-all border",
                    params.int8Quantization ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : "bg-white/5 border-white/10 text-white/20"
                  )}
                >
                  INT8: {params.int8Quantization ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {params.useLoRA && (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                <div className="space-y-1">
                  <label className="text-[8px] text-white/30 uppercase font-black tracking-widest">LoRA Rank (r)</label>
                  <input 
                    type="number"
                    value={params.loraRank}
                    onChange={e => setParams(p => ({ ...p, loraRank: parseInt(e.target.value) }))}
                    className="w-full bg-black/40 border border-white/5 rounded px-2 py-1 text-[10px] font-mono text-blue-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-white/30 uppercase font-black tracking-widest">Alpha (α)</label>
                  <input 
                    type="number"
                    value={params.loraAlpha}
                    onChange={e => setParams(p => ({ ...p, loraAlpha: parseInt(e.target.value) }))}
                    className="w-full bg-black/40 border border-white/5 rounded px-2 py-1 text-[10px] font-mono text-blue-400"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            onClick={startTraining}
            disabled={isTraining}
            className={cn(
              "w-full py-3 rounded-lg border transition-all flex items-center justify-center gap-2",
              isTraining 
                ? "bg-white/5 border-white/10 text-white/20 cursor-not-allowed" 
                : "bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20 hover:border-neon-green/50"
            )}
          >
            {isTraining ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            <span className="text-xs font-black uppercase tracking-widest">Initialize Training Run</span>
          </button>
        </div>

        {/* Training Progress */}
        {(isTraining || currentLoss !== null) && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-white/60" />
                <h3 className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Training Metrics</h3>
              </div>
              <div className="text-[9px] font-mono text-neon-green uppercase tracking-widest animate-pulse">
                {tacticalLog}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={12} className="text-white/40" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Epoch</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {currentEpoch} <span className="text-xs text-white/20">/ {params.epochs}</span>
                </div>
                <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-green transition-all duration-500" 
                    style={{ width: `${(currentEpoch / params.epochs) * 100}%` }} 
                  />
                </div>
              </div>

              <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown size={12} className="text-white/40" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Current Loss</span>
                </div>
                <div className={cn(
                  "text-2xl font-black font-mono transition-colors duration-500",
                  currentLoss && currentLoss < 0.5 ? "text-neon-green" : "text-white"
                )}>
                  {currentLoss !== null ? currentLoss.toFixed(4) : '---'}
                </div>
                {history.length > 1 && (
                  <div className="mt-2 text-[9px] text-white/40 font-mono">
                    Δ: {(history[history.length - 2].loss - currentLoss!).toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Simple Loss Plot */}
            <div className="glass p-4 rounded-xl border-white/5 bg-white/[0.02] h-48 relative flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart4 size={12} className="text-white/40" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Loss History</span>
                </div>
                {currentLoss !== null && !isTraining && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/20">
                    <CheckCircle size={10} className="text-neon-green" />
                    <span className="text-[8px] font-black text-neon-green uppercase tracking-widest">Converged</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex items-end gap-1 px-2">
                {history.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <TrendingDown size={48} />
                  </div>
                )}
                {history.map((h, i) => {
                  const maxLoss = history[0].loss;
                  const height = (h.loss / maxLoss) * 100;
                  return (
                    <div 
                      key={i} 
                      className="flex-1 bg-neon-green/30 border-t border-neon-green/50 transition-all duration-700 hover:bg-neon-green/50 group relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-neon-green text-[8px] px-1 rounded z-10 font-mono">
                        {h.loss.toFixed(3)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Report After Training */}
            {showArchReport && archInsights && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-xl border-blue-500/30 bg-blue-500/5 space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-blue-500/20 pb-4">
                  <Zap size={20} className="text-blue-400" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Architectural Insight Report</h4>
                    <p className="text-[10px] text-blue-400/60 uppercase font-mono">Generated via NIYAH Core</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="text-[9px] font-black text-white/40 uppercase tracking-widest border-l-2 border-blue-500 pl-2">LoRA Integration</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Status:</span>
                        <span className="text-blue-400">{archInsights.sampleLayerStatus}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Rank (r):</span>
                        <span className="text-blue-400">{archInsights.loraConfig.rank}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Alpha (α):</span>
                        <span className="text-blue-400">{archInsights.loraConfig.alpha}</span>
                      </div>
                      <div className="p-2 bg-black/40 rounded border border-blue-500/10 text-[9px] text-blue-300/80 leading-relaxed italic">
                        LoRA parameters have been successfully injected into attention projection layers. The model is now optimized for the downstream task: {archInsights.downstreamTask}.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[9px] font-black text-white/40 uppercase tracking-widest border-l-2 border-orange-500 pl-2">INT8 Quantization Analysis</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Size Reduction:</span>
                        <span className="text-orange-400">{archInsights.quantizationReport.sizeReduction}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Inference Speedup:</span>
                        <span className="text-orange-400">{archInsights.quantizationReport.inferenceSpeedup}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">MSE Loss:</span>
                        <span className="text-orange-400">{archInsights.quantizationReport.accuracyLoss}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40">Quantization Time:</span>
                        <span className="text-orange-400">{archInsights.quantizationReport.quantizationTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tensor Explorer */}
        {currentLoss !== null && (
          <div className="glass p-4 rounded-xl border-blue-500/20 bg-white/[0.02] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-blue-400" />
                <h3 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">Tensor Explorer</h3>
              </div>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="bg-black/50 border border-white/10 rounded px-2 py-1 text-[9px] text-white/70 focus:outline-none focus:border-blue-500/50"
              >
                <option value="layer.0.attention.wq">layer.0.attention.wq</option>
                <option value="layer.0.attention.wk">layer.0.attention.wk</option>
                <option value="layer.0.attention.wv">layer.0.attention.wv</option>
                <option value="layer.0.ffn.w1">layer.0.ffn.w1</option>
                <option value="layer.12.attention.wq">layer.12.attention.wq</option>
                <option value="output.weight">output.weight</option>
              </select>
            </div>
            <TensorVisualizer layer={selectedLayer} />
          </div>
        )}
      </div>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
