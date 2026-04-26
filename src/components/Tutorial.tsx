import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  Shield, 
  Zap, 
  Target, 
  LayoutDashboard,
  BrainCircuit,
  Flag
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const STEPS = [
  {
    title: "The Sovereign Kernel",
    description: "Welcome to NIYAH v3.0. You are now commanding a Sovereign AI Kernel integrated with Metasploit modules for high-level tactical response.",
    icon: BrainCircuit,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Tactical Logistics",
    description: "Use Mission Control to manage objectives. Your task data is synced across nodes via encrypted Firestore channels.",
    icon: Target,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "MSF Kernel Intelligence",
    description: "The AI agent now identifies exploitation vectors proactively. Try asking it to 'analyze target windows-local' to see MSF integration in action.",
    icon: Terminal,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Sovereign Chat",
    description: "Communicate with the NIYAH core. It uses independent reasoning paths to provide raw technical truth without traditional AI filters.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Command Console",
    description: "Monitor node status, performance benchmarks, and real-time forensic dossiers through the main Dashboard.",
    icon: LayoutDashboard,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  }
];

export const Tutorial: React.FC = () => {
  const { setShowTutorial, setProfile, profile } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleComplete = () => {
    setShowTutorial(false);
    if (profile) {
      const updatedProfile = { ...profile, completedTutorial: true };
      setProfile(updatedProfile);
      
      // Update in local storage if profiles exist
      const savedProfiles = localStorage.getItem('niyah_user_profiles');
      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        const updated = profiles.map((p: any) => p.id === profile.id ? updatedProfile : p);
        localStorage.setItem('niyah_user_profiles', JSON.stringify(updated));
      }
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Progress bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          {STEPS.map((_, i) => (
            <div 
              key={i}
              className={cn(
                "flex-1 transition-all duration-500",
                i <= currentStep ? "bg-blue-500" : "bg-white/5"
              )}
            />
          ))}
        </div>

        <div className="p-10 space-y-8">
          <div className="flex justify-between items-start">
            {(() => {
              const Icon = STEPS[currentStep].icon;
              return (
                <div className={cn("p-4 rounded-3xl", STEPS[currentStep].bg)}>
                  <Icon className={cn("w-8 h-8", STEPS[currentStep].color)} />
                </div>
              );
            })()}
            <button 
              onClick={handleComplete}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Module {currentStep + 1}</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {STEPS[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-white/10",
                currentStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/5 active:scale-95"
              )}
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextStep}
              className="flex-1 h-14 bg-white hover:bg-blue-50 active:scale-95 text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 group transition-all"
            >
              {currentStep === STEPS.length - 1 ? (
                <>
                  <Flag className="w-5 h-5" />
                  Finalize Mission
                </>
              ) : (
                <>
                  Next Module
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cinematic accents */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      </motion.div>
    </motion.div>
  );
};
