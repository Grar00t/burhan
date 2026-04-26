import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, Zap, Search, Lock, Unlock, 
  Eye, EyeOff, RefreshCw, AlertTriangle, CheckCircle2, 
  XCircle, ChevronRight, Activity, Cpu, Database, 
  Globe, Fingerprint, Wifi, HardDrive, Network, FileText,
  ExternalLink, Download
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { TOOLS, CATEGORY_COLORS } from './hacking/tools';
import type { HackTool } from './hacking/types';

export function HackingToolkit() {
  const { language, setShowReport } = useStore();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ status: string; findings: number; threatLevel: string } | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const runTool = async (tool: HackTool) => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setLogs([]);
    
    addLog(`Initializing ${tool.name}...`);
    addLog(`Command: ${tool.command}`);
    
    if (tool.isReal && tool.runner) {
      // Real Tool Execution
      try {
        const output = await tool.runner();
        // Simulate progress for UI feel
        for (let i = 0; i <= 100; i += 20) {
          setProgress(i);
          await new Promise(r => setTimeout(r, 150));
        }
        output.forEach(line => addLog(line));
        setResults({
          status: output.some(l => l.includes('CRITICAL') || l.includes('WARNING')) ? 'vulnerable' : 'secure',
          findings: output.filter(l => l.includes('⚠️')).length,
          threatLevel: output.some(l => l.includes('CRITICAL')) ? 'high' : 'low'
        });
      } catch (err) {
        addLog(`[ERROR] Tool execution failed: ${err}`);
      }
    } else if (tool.simulatedOutput) {
      // Simulated Tool Execution
      const totalSteps = tool.simulatedOutput.length;
      const stepDuration = tool.duration / totalSteps;
      
      for (let i = 0; i < totalSteps; i++) {
        await new Promise(r => setTimeout(r, stepDuration));
        addLog(tool.simulatedOutput[i]);
        setProgress(((i + 1) / totalSteps) * 100);
      }
      
      setResults({
        status: 'simulated_success',
        findings: 0,
        threatLevel: 'none'
      });
    }
    
    setIsRunning(false);
    addLog('Process completed.');
    
    if (tool.id === 'sovereign_extraction') {
      setTimeout(() => setShowReport(true), 1000);
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {language === 'ar' ? 'ترسانة السيادة' : 'SOVEREIGN ARSENAL'}
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
            {language === 'ar' 
              ? 'أدوات متقدمة للكشف عن التجسس الرقمي وحماية السيادة التقنية. وضع الاستجابة الطارئة نشط.' 
              : 'Advanced tools for digital surveillance detection and technical sovereignty. Emergency Response Mode active.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tool Grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-3 h-fit">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveToolId(tool.id);
                  runTool(tool);
                }}
                disabled={isRunning}
                className={`flex flex-col p-4 rounded-2xl transition-all border text-left group relative overflow-hidden ${
                  activeToolId === tool.id 
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500/30'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeToolId === tool.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-emerald-500'
                  }`}>
                    <tool.icon size={18} />
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border" style={{ 
                    color: CATEGORY_COLORS[tool.category].color,
                    borderColor: `${CATEGORY_COLORS[tool.category].color}40`,
                    backgroundColor: `${CATEGORY_COLORS[tool.category].color}10`
                  }}>
                    {CATEGORY_COLORS[tool.category].label}
                  </span>
                </div>
                
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                  {language === 'ar' ? tool.nameAr : tool.name}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>

                {activeToolId === tool.id && isRunning && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Terminal & Results */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[500px]">
              {/* Terminal Header */}
              <div className="bg-slate-800/50 px-5 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest ml-2">
                    <Terminal size={12} />
                    <span>haven_sovereign_v5</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500 font-mono text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                    <span>{isRunning ? 'EXECUTING' : 'READY'}</span>
                  </div>
                </div>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-6 font-mono text-[12px] overflow-y-auto scrollbar-hide bg-[#020617]">
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-40">
                    <Activity size={48} />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Select tool to initiate sequence</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {logs.map((log, i) => {
                      const isError = log.includes('[ERROR]') || log.includes('[CRITICAL]');
                      const isWarning = log.includes('[WARNING]');
                      const isSuccess = log.includes('[SUCCESS]') || log.includes('[OK]');
                      
                      return (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${
                            isError ? 'text-rose-400' : 
                            isWarning ? 'text-amber-400' : 
                            isSuccess ? 'text-emerald-400' : 
                            'text-emerald-500/70'
                          }`}
                        >
                          <span className="text-slate-600 mr-2">»</span>
                          {log}
                        </motion.div>
                      );
                    })}
                    <div ref={logEndRef} />
                  </div>
                )}
              </div>

              {/* Terminal Footer */}
              <div className="bg-slate-800/30 px-6 py-3 border-t border-slate-800 flex items-center gap-3">
                <span className="text-emerald-500/50 font-bold text-xs">haven@sovereign:~$</span>
                <div className="flex-1 text-emerald-500/30 font-mono text-xs italic">
                  {isRunning ? `running ${activeTool?.command}...` : 'awaiting input...'}
                </div>
              </div>
            </div>

            {/* Result Card */}
            <AnimatePresence>
              {results && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-3xl border shadow-xl ${
                    results.threatLevel === 'high' 
                      ? 'bg-rose-500/5 border-rose-500/20' 
                      : 'bg-emerald-500/5 border-emerald-500/20'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-2xl ${
                      results.threatLevel === 'high' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {results.threatLevel === 'high' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
                    </div>
                    <div>
                      <h4 className={`font-black uppercase tracking-widest text-[10px] ${
                        results.threatLevel === 'high' ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {language === 'ar' ? 'نتيجة التدقيق الأمني' : 'SECURITY AUDIT RESULT'}
                      </h4>
                      <p className="text-slate-900 dark:text-white text-xl font-bold">
                        {results.threatLevel === 'high' 
                          ? (language === 'ar' ? 'تم اكتشاف تهديدات!' : 'Threats Detected!') 
                          : (language === 'ar' ? 'النظام محمي بالكامل' : 'System Fully Protected')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <StatBox label={language === 'ar' ? 'الحالة' : 'Status'} value={results.status.toUpperCase()} color={results.threatLevel === 'high' ? 'rose' : 'emerald'} />
                    <StatBox label={language === 'ar' ? 'المكتشفات' : 'Findings'} value={results.findings.toString()} />
                    <StatBox label={language === 'ar' ? 'مستوى التهديد' : 'Threat'} value={results.threatLevel.toUpperCase()} color={results.threatLevel === 'high' ? 'rose' : 'emerald'} />
                  </div>

                  {activeTool?.officialUrl && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 pt-6 border-t border-slate-800"
                    >
                      <a 
                        href={activeTool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 group"
                      >
                        <Download size={18} className="group-hover:scale-110 transition-transform" />
                        <span>{language === 'ar' ? 'تحميل النسخة الرسمية' : 'DOWNLOAD OFFICIAL VERSION'}</span>
                        <ExternalLink size={14} className="opacity-50" />
                      </a>
                      <p className="text-[9px] text-slate-500 mt-3 text-center font-mono uppercase tracking-tighter">
                        {language === 'ar' 
                          ? 'رابط مباشر من المصدر الرسمي - لا وسيط، لا فلترة.' 
                          : 'Direct link from official source - No proxy, no filtering.'}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ label, value, color = 'slate' }: { label: string; value: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    rose: 'text-rose-400',
    emerald: 'text-emerald-400',
    slate: 'text-white'
  };

  return (
    <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-800/50">
      <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-wider">{label}</p>
      <p className={`text-xs font-mono font-bold truncate ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}

