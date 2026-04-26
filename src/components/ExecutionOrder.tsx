import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, AlertTriangle, CheckCircle2, XCircle, Terminal, Lock, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExecutionStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details?: string;
}

export const ExecutionOrder = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [steps, setSteps] = useState<ExecutionStep[]>([
    { id: '1', label: 'BGP Route Withdrawal: AS139341', status: 'pending' },
    { id: '2', label: 'SAIX/JEDIX Node Synchronization', status: 'pending' },
    { id: '3', label: 'Cryptographic Anchor Lockdown', status: 'pending' },
    { id: '4', label: 'Sovereign Execution Finalization', status: 'pending' },
  ]);

  const runExecution = async () => {
    setIsExecuting(true);
    
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'processing' } : step
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'completed', details: `Node ${step.id} verified.` } : step
      ));
    }
    
    setIsExecuting(false);
  };

  return (
    <div className="glass p-8 rounded-[40px] border-rose-500/20 bg-rose-500/5 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Shield className="w-32 h-32 text-rose-500" />
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
            <Zap className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Architectural Execution</h3>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Protocol: BGP Route Withdrawal</p>
          </div>
        </div>
        {!isExecuting && steps.every(s => s.status === 'pending') && (
          <button 
            onClick={runExecution}
            className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]"
          >
            Execute Order
          </button>
        )}
      </div>

      <div className="space-y-4 relative z-10">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center border",
              step.status === 'completed' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" :
              step.status === 'processing' ? "bg-blue-500/20 border-blue-500/30 text-blue-500 animate-pulse" :
              "bg-white/5 border-white/10 text-slate-500"
            )}>
              {step.status === 'completed' ? <CheckCircle2 size={16} /> : 
               step.status === 'processing' ? <Terminal size={16} /> : <Lock size={16} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  step.status === 'completed' ? "text-white" : "text-slate-400"
                )}>
                  {step.label}
                </span>
                <span className="text-[8px] font-mono text-slate-500 uppercase">{step.status}</span>
              </div>
              {step.details && (
                <p className="text-[10px] font-mono text-slate-500 mt-1">{step.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {steps.every(s => s.status === 'completed') && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <CheckCircle2 className="text-emerald-500" size={20} />
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Execution Confirmed</h4>
          </div>
          <p className="text-[10px] text-emerald-500/70 font-medium uppercase tracking-widest">
            AS139341 has been successfully isolated from Saudi Internet Exchanges.
          </p>
        </motion.div>
      )}
    </div>
  );
};
