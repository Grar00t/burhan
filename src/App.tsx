import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import SovereignAIChat from './components/SovereignAIChat';
import MissionControl from './components/MissionControl';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import { PhalanxGuardian } from './components/PhalanxGuardian';
import { Benchmarks } from './components/Benchmarks';
import { KForge } from './components/KForge';
import FieldTools from './components/FieldTools';
import { AIEngine } from './components/AIEngine';
import Delegate from './components/Delegate';
import MediaLab from './components/MediaLab';
import EthicsPanel from './components/EthicsPanel';
import Settings from './components/Settings';
import TensorViz from './components/TensorViz';
import ForensicDossier from './components/ForensicDossier';
import { Tutorial } from './components/Tutorial';
import FinalReport from './components/FinalReport'; // Updated Import
import { CommandPalette } from './components/CommandPalette';
import SovereignStrategy from './components/SovereignStrategy';
import KSpikeDashboard from './components/KSpikeDashboard';
import { useStore } from './store/useStore';

export default function App() {
  const { bypassAuth, setBypassAuth, activeTab, setProfile, profile, language, setLanguage, setShowTutorial, showTutorial, theme } = useStore();
  const [isBooting, setIsBooting] = useState(true);

  // Local Sovereign Operator Identity
  const user = { uid: 'sovereign_operator_01', email: 'operator@gratech.sa' };

  useEffect(() => {
    // 🎨 Apply theme class to the document root
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // ⚡ Simulate core kernel initialization & Sovereign WASM loading
    const timer = setTimeout(() => setIsBooting(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Local-only profile initialization
    const initLocalProfile = () => {
      const savedProfile = localStorage.getItem('niyah_profile');
      if (savedProfile) {
        const data = JSON.parse(savedProfile);
        setProfile(data);
        if (data.language) setLanguage(data.language);
      } else {
        const newProfile = {
          language: language,
          theme: 'dark',
          completedTutorial: false,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('niyah_profile', JSON.stringify(newProfile));
        setProfile(newProfile as any);
        setShowTutorial(true);
      }
    };
    initLocalProfile();
  }, []);

  if (isBooting) {
    return (
      <div className="bg-[#0a0a0a] text-[#00ffc8] h-screen w-screen overflow-hidden font-mono selection:bg-[#00ffc8]/30">
        <AnimatePresence>
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]"
          >
            {/* Visual Radar / Neural Ring */}
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-40 h-40 border-t-2 border-b border-[#00ffc8]/40 rounded-full shadow-[0_0_30px_rgba(0,255,200,0.2)]"
              />
              <motion.div
                initial={{ rotate: 45 }}
                animate={{ rotate: -315 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute inset-0 border-l border-r border-[#ffc800]/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-1 h-1 bg-[#00ffc8] rounded-full animate-ping" />
              </div>
            </div>

            <div className="mt-12 text-center space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg tracking-[0.5em] uppercase font-black text-white"
              >
                [ NIYAH KERNEL INITIALIZING ]
              </motion.h1>
              
              <div className="flex flex-col gap-1">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.5, 1] }}
                  transition={{ delay: 0.8, duration: 1.5, repeat: Infinity }}
                  className="text-[9px] font-mono text-[#00ffc8]/50 uppercase tracking-[0.3em]"
                >
                  Establishing Sovereign Node... PASS
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-[9px] font-mono text-[#00ffc8]/50 uppercase tracking-[0.3em]"
                >
                  Neural Weights Anchored... SUCCESS
                </motion.p>
              </div>
            </div>
            
            {/* Binary Rain Fade */}
            <div className="absolute bottom-10 left-10 text-[8px] text-[#00ffc8]/10 font-mono hidden md:block">
              {Array.from({ length: 5 }).map((_, i) => (
                <p key={i}>0x{Math.random().toString(16).substr(2, 16)}</p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Handle Login / Auth (Simplified for Sovereign Demo)
  // We bypass cloud auth entirely
  
  return (
    <Layout>
      <CommandPalette />
      <div className="h-full flex overflow-hidden relative">
        <AnimatePresence>
          {showTutorial && <Tutorial />}
        </AnimatePresence>
        
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex overflow-hidden h-full"
            >
              <SovereignAIChat />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <Dashboard />
            </motion.div>
          )}

          {activeTab === 'forensics' && (
            <motion.div 
              key="forensics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <ForensicDossier />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <MissionControl />
            </motion.div>
          )}

          {activeTab === 'phalanx' && (
            <motion.div 
              key="phalanx"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 overflow-hidden h-full"
            >
              <PhalanxGuardian />
            </motion.div>
          )}

          {activeTab === 'kspike' && (
            <motion.div 
              key="kspike"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <KSpikeDashboard />
            </motion.div>
          )}

          {activeTab === 'benchmarks' && (
            <motion.div 
              key="benchmarks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <Benchmarks />
            </motion.div>
          )}

          {activeTab === 'kforge' && (
            <motion.div 
              key="kforge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <KForge />
            </motion.div>
          )}

          {activeTab === 'field' && (
            <motion.div 
              key="field"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <FieldTools />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div 
              key="ai"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <AIEngine />
            </motion.div>
          )}

          {activeTab === 'delegate' && (
            <motion.div 
              key="delegate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <Delegate />
            </motion.div>
          )}

          {activeTab === 'media' && (
            <motion.div 
              key="media"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <MediaLab />
            </motion.div>
          )}

          {activeTab === 'tensors' && (
            <motion.div 
              key="tensors"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <TensorViz />
            </motion.div>
          )}

          {activeTab === 'ethics' && (
            <motion.div 
              key="ethics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <EthicsPanel />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <Settings />
            </motion.div>
          )}

          {activeTab === 'kreport' && (
            <motion.div 
              key="kreport"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 overflow-y-auto h-full"
            >
              <FinalReport />
            </motion.div>
          )}

          {activeTab === 'strategy' && (
            <motion.div 
              key="strategy"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 overflow-y-auto h-full p-8"
            >
              <SovereignStrategy />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Side Panel for specific tabs */}
        {(activeTab === 'chat' || activeTab === 'dashboard') && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-96 border-l border-white/5 hidden lg:block"
          >
            <MissionControl />
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
