import { useState, useCallback } from 'react';
import { AlertTriangle, ShieldCheck, Activity, Volume2, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const PhalanxGuardian = () => {
    const [volume, setVolume] = useState(0.5);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<{name: string, pld: number, risk: 'low' | 'med' | 'high'}[]>([]);
    const [alertSound, setAlertSound] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');

    const playAlert = useCallback((typeOverride?: 'sine' | 'square' | 'sawtooth' | 'triangle', freqOverride?: number) => {
        try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = typeOverride || alertSound;
            oscillator.frequency.setValueAtTime(freqOverride || (typeOverride === 'square' ? 220 : 440), audioCtx.currentTime); 
            gainNode.gain.setValueAtTime(volume * 0.2, audioCtx.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (e) {
            console.warn("Audio Context blocked or failed:", e);
        }
    }, [volume, alertSound]);

    const runSecurityScan = () => {
        setIsScanning(true);
        setScanResults([]);
        
        setTimeout(() => {
            const mockProcesses = [
                { name: 'kernel_task', pld: 1024, risk: 'low' as const },
                { name: 'niyah_engine_v2', pld: 512, risk: 'low' as const },
                { name: 'hidden_msf_binary', pld: 4444, risk: 'high' as const },
                { name: 'unauthorized_listener', pld: 8080, risk: 'med' as const },
            ];
            
            setScanResults(mockProcesses);
            setIsScanning(false);
            
            // Play sonic alerts for critical threats found
            const hasHighRisk = mockProcesses.some(p => p.risk === 'high');
            if (hasHighRisk) {
                // Play a more aggressive sound
                playAlert('square', 150);
                setTimeout(() => playAlert('square', 150), 200);
            } else {
                playAlert('sine', 880);
            }
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col gap-6 p-8 bg-[#050505] text-white overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <ShieldAlert className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">PHALANX GUARDIAN</h1>
                        <p className="text-[10px] font-mono text-red-400 uppercase tracking-[0.2em]">Active Threat Mitigation & Sonic Defense</p>
                    </div>
                </div>
                
                <button 
                    onClick={runSecurityScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                >
                    {isScanning ? <Activity size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    {isScanning ? 'Scanning...' : 'Activate Phalanx Scan'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                {/* Sonic Controls */}
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] space-y-6">
                    <div className="flex items-center gap-3">
                        <Volume2 className="text-red-500" size={18} />
                        <h2 className="text-xs font-bold text-white uppercase tracking-widest">Sonic Alert Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Master Volume</label>
                                <span className="text-[10px] font-mono text-red-500">{(volume * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={volume} 
                                onChange={(e) => setVolume(parseFloat(e.target.value))} 
                                className="w-full accent-red-500 h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest px-1">Alert Sound Profile</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['sine', 'square', 'sawtooth', 'triangle'] as const).map(sound => (
                                    <button
                                        key={sound}
                                        onClick={() => {
                                            setAlertSound(sound);
                                            playAlert(sound);
                                        }}
                                        className={cn(
                                            "py-2 rounded-xl text-[10px] font-bold uppercase border transition-all",
                                            alertSound === sound ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                        )}
                                    >
                                        {sound}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => playAlert()}
                            className="w-full py-4 rounded-2xl border border-red-500/30 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/10 transition-all"
                        >
                            Test Detection Cue
                        </button>
                    </div>
                </div>

                {/* Scan Results */}
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="text-red-500" size={18} />
                        <h2 className="text-xs font-bold text-white uppercase tracking-widest">Process Entropy Guard</h2>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {scanResults.length > 0 ? (
                                scanResults.map((proc, i) => (
                                    <motion.div
                                        key={proc.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={cn(
                                            "p-4 rounded-2xl border flex items-center justify-between group",
                                            proc.risk === 'high' ? "bg-red-500/10 border-red-500/40" : 
                                            proc.risk === 'med' ? "bg-amber-500/10 border-amber-500/40" : 
                                            "bg-white/[0.02] border-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                proc.risk === 'high' ? "bg-red-500 animate-ping" : 
                                                proc.risk === 'med' ? "bg-amber-500" : "bg-emerald-500"
                                            )} />
                                            <div>
                                                <p className="text-[11px] font-mono font-bold text-white/80">{proc.name}</p>
                                                <p className="text-[9px] font-mono text-white/30">PID: {proc.pld} • {proc.risk.toUpperCase()} RISK</p>
                                            </div>
                                        </div>
                                        {proc.risk === 'high' && <AlertTriangle size={14} className="text-red-500" />}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                                    <ShieldAlert className="mb-4" size={48} />
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em]">No Active Scan Data</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Forensic Logs */}
            <div className="p-8 bg-black border border-white/5 rounded-[32px] font-mono shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="text-red-500" size={14} />
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Global Defense Ledger</span>
                </div>
                <div className="space-y-1.5 opacity-60 text-[10px]">
                    <p className="text-emerald-400">[*] PHALANX KERNEL LOADED AT 2026-04-20 22:59:12Z</p>
                    <p>[*] Baseline entropy established. System integrity verified.</p>
                    {scanResults.length > 0 && <p className="text-red-500">[!] CRITICAL: Unauthorized MSF payload detected in /proc/4444</p>}
                    <p className="animate-pulse">_</p>
                </div>
            </div>
        </div>
    );
};
