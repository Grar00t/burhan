import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Heart, 
  Scale, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  History,
  Fingerprint,
  Globe,
  Users,
  Zap
} from 'lucide-react';
import { CORE_PHILOSOPHY, FitrahEthicsEngine } from '../lib/ethics';
import { cn } from '../lib/utils';

export default function EthicsPanel() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('niyah_consent_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
            <Heart className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Fitrah <span className="text-emerald-500">Ethics</span></h1>
            <p className="text-sm text-slate-400 font-medium tracking-wide">The core philosophy and ethical framework of GraTech AI.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Philosophy Display */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-10 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale className="w-64 h-64 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <pre className="font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre-wrap">
                {CORE_PHILOSOPHY}
              </pre>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Universal Service</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No bias towards religion, nation, race, or gender. We serve all humanity with equal respect and integrity.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sovereign Control</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The human is the master. AI is the servant. Your decisions are final, and we prioritize your control over your data.
              </p>
            </div>
          </div>
        </div>

        {/* Ethics Engine Status & Logs */}
        <div className="lg:col-span-5 space-y-8">
          <section className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" /> Engine Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-200">Safety Filter</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-200">Consent Logging</span>
                </div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Encrypted</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-bold text-slate-200">Anti-Hallucination</span>
                </div>
                <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">v2.1</span>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" /> Consent Records
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <div key={record.id} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Consent Granted</span>
                      <span className="text-[9px] text-slate-600">{new Date(record.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium truncate">{record.action}</p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-600 font-mono">
                      <Lock className="w-3 h-3" />
                      {record.hash}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-slate-800 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">No restricted actions performed yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 3 3 0 1 0 5.327-3.545" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105 3 3 0 1 1-5.327-3.545" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.5 18a4.5 4.5 0 0 1-5.5-4 4.5 4.5 0 0 1-5.5 4" />
      <path d="M12 10v4" />
      <path d="M12 14v4" />
    </svg>
  );
}
