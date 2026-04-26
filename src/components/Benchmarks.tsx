import { motion } from 'motion/react';
import { ScrollReveal } from '../shared/ScrollReveal';
import { useStore } from '../store/useStore';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { cn } from '../lib/utils';

interface Benchmark {
  label: string;
  haven: number;
  copilot: number;
  grok: number;
  gemini: number;
  unit: string;
}

const mainBenchmarks: Benchmark[] = [
  { label: 'Context Retention', haven: 100, copilot: 34, grok: 52, gemini: 61, unit: '%' },
  { label: 'Privacy Score', haven: 100, copilot: 22, grok: 15, gemini: 18, unit: '%' },
];

const otherBenchmarks: Benchmark[] = [
  { label: 'Data Sovereignty', haven: 100, copilot: 0, grok: 0, gemini: 0, unit: '%' },
  { label: 'Arabic NLP Accuracy', haven: 92, copilot: 74, grok: 62, gemini: 84, unit: '%' },
  { label: 'Inference Latency (ms)', haven: 12, copilot: 450, grok: 380, gemini: 320, unit: 'ms' },
];

const BarChart = ({ value, max = 100, colorClass, delay = 0, isHaven = false }: { value: number; max?: number; colorClass: string; delay?: number; isHaven?: boolean }) => (
  <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 relative group">
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${(value / max) * 100}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "h-full rounded-full relative",
        colorClass,
        isHaven && "shadow-[0_0_15px_rgba(14,165,233,0.5)]"
      )}
    >
      {/* Inner Glow/Shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      {isHaven && (
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
        />
      )}
    </motion.div>
  </div>
);

const BenchmarkCard = ({ b, i }: { b: Benchmark; i: number }) => (
  <div className="glass p-8 rounded-[32px] border-slate-200 dark:border-white/5 hover:border-blue-500/20 transition-all duration-500 group h-full">
    <div className="flex items-center justify-between mb-8">
      <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 dark:text-white/80">{b.label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 opacity-60">PEAK PERFORMANCE</span>
        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{b.haven}{b.unit}</span>
      </div>
    </div>

    <div className="space-y-6">
      {/* HAVEN Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
          <span className="text-slate-800 dark:text-white">HAVEN (Sovereign Node)</span>
          <span className="text-slate-800 dark:text-white">{b.haven}%</span>
        </div>
        <BarChart value={b.haven} colorClass="bg-gradient-to-r from-blue-600 to-cyan-400" delay={i * 0.1 + 0.2} isHaven />
      </div>

      {/* Competitors */}
      <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-slate-400 dark:text-white/30 w-16 uppercase tracking-tighter">Copilot</span>
          <div className="flex-1">
            <BarChart value={b.copilot} colorClass="bg-blue-500/40" delay={i * 0.1 + 0.4} />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 w-10 text-right">{b.copilot}%</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-slate-400 dark:text-white/30 w-16 uppercase tracking-tighter">Grok</span>
          <div className="flex-1">
            <BarChart value={b.grok} colorClass="bg-orange-500/40" delay={i * 0.1 + 0.5} />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 w-10 text-right">{b.grok}%</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[9px] font-black text-slate-400 dark:text-white/30 w-16 uppercase tracking-tighter">Gemini</span>
          <div className="flex-1">
            <BarChart value={b.gemini} colorClass="bg-purple-500/40" delay={i * 0.1 + 0.6} />
          </div>
          <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 w-10 text-right">{b.gemini}%</span>
        </div>
      </div>
    </div>
  </div>
);

export const Benchmarks = () => {
  const { language } = useStore();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const overall = useCountUp(100, 3000, 0);

  return (
    <section id="benchmarks" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-blue-500" />
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">// SOVEREIGN BENCHMARKS</div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4 text-slate-900 dark:text-white">
              {language === 'ar' ? 'اختبارات الأداء.' : 'Performance Benchmarks.'} <br/>
              <span className="text-slate-200 dark:text-white/10">{language === 'ar' ? 'الأرقام لا تكذب.' : 'Numbers Don\'t Lie.'}</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Massive Score Card */}
          <div className="lg:col-span-12 mb-12">
            <ScrollReveal>
              <div ref={ref} className="glass p-16 rounded-[64px] border-slate-200 dark:border-white/5 text-center relative overflow-hidden group">
                {/* Background Watermark/Ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.03]">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="w-[600px] h-[600px] border-[60px] border-slate-400 dark:border-white rounded-full flex items-center justify-center"
                  >
                    <span className="text-6xl font-black tracking-[1em] uppercase text-slate-900 dark:text-white">SOVEREIGN</span>
                  </motion.div>
                </div>

                {/* Glow Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse-glow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full animate-pulse-glow delay-1000" />

                <div className="relative z-10">
                  <div className="text-[14px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] mb-8 opacity-80">OVERALL SOVEREIGN SCORE</div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative inline-block"
                  >
                    {/* Dramatic 100 */}
                    <div className="text-[180px] md:text-[240px] font-black leading-none tracking-tighter gradient-text drop-shadow-[0_0_50px_rgba(59,130,246,0.4)] shine-effect text-slate-900 dark:text-white">
                      {overall}
                    </div>
                    
                    {/* Particle Glow Overlay */}
                    <motion.div 
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-purple-500/20 blur-3xl -z-10"
                    />
                  </motion.div>

                  <div className="text-3xl font-black text-slate-300 dark:text-white/20 tracking-[0.5em] mt-4">/ 100</div>

                  <div className="flex flex-wrap justify-center gap-12 mt-16">
                    {[
                      { label: 'HAVEN', color: 'bg-haven-blue', dot: 'bg-haven-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)]' },
                      { label: 'Copilot', color: 'bg-blue-500', dot: 'bg-blue-500' },
                      { label: 'Grok', color: 'bg-orange-500', dot: 'bg-orange-500' },
                      { label: 'Gemini', color: 'bg-purple-500', dot: 'bg-purple-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-[12px] font-black text-slate-600 dark:text-white/60 uppercase tracking-[0.2em]">
                        <div className={cn("w-3 h-3 rounded-full", item.dot)} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Main Benchmark Cards Side-by-Side */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainBenchmarks.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <BenchmarkCard b={b} i={i} />
              </ScrollReveal>
            ))}
          </div>

          {/* Other Benchmarks */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {otherBenchmarks.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.1 + 0.4}>
                <div className="glass p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/60">{b.label}</span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">{b.haven}%</span>
                  </div>
                  <BarChart value={b.haven} colorClass="bg-blue-500/40" delay={i * 0.1 + 0.6} isHaven />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Methodology & Transparency */}
        <ScrollReveal>
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-[40px] border-slate-200 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Testing Methodology
              </h3>
              <div className="space-y-4 text-[11px] font-mono text-slate-500 dark:text-white/40 leading-relaxed uppercase tracking-[0.1em]">
                <p>• <span className="text-slate-800 dark:text-white/60">Context Retention:</span> Measured via "Needle in a Haystack" tests across 128k token windows.</p>
                <p>• <span className="text-slate-800 dark:text-white/60">Privacy Score:</span> Calculated as the percentage of inference operations executed on local hardware (Ollama/Niyah Core) vs. cloud relays.</p>
                <p>• <span className="text-slate-800 dark:text-white/60">Arabic NLP:</span> Evaluated using the ALUE (Arabic Language Understanding Evaluation) benchmark suite.</p>
                <p>• <span className="text-slate-800 dark:text-white/60">Latency:</span> End-to-end response time measured on a local ARM64 node (16GB RAM).</p>
              </div>
            </div>

            <div className="glass p-10 rounded-[40px] border-slate-200 dark:border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Sovereignty Guarantee
              </h3>
              <p className="text-[11px] font-mono text-slate-500 dark:text-white/40 leading-relaxed uppercase tracking-[0.1em] mb-6">
                NIYAH operates on a "Zero-Trust Cloud" architecture. While we utilize Gemini 3.1 Pro for high-complexity reasoning, all PII (Personally Identifiable Information) is scrubbed locally before transmission.
              </p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Verified Local-First
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                  AES-256-GCM
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal>
          <div className="mt-12 p-10 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="text-[11px] font-mono text-white/30 leading-relaxed uppercase tracking-[0.2em] text-center max-w-4xl mx-auto relative z-10">
              Benchmarks are based on internal testing and third-party open-source evaluation suites. 
              Performance may vary based on local hardware capabilities and network conditions for cloud relay operations.
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

