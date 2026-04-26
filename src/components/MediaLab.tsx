import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Download, 
  Trash2, 
  Loader2, 
  Plus, 
  Activity,
  History,
  ScanText,
  SearchCode,
  Eye,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { casper } from '../lib/Casper';
import { niyahEngine } from '../lib/NiyahEngine';

interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'analysis';
  prompt: string;
  url: string;
  createdAt: string;
  metadata?: any;
}

const LOCAL_USER_ID = 'sovereign_operator_01';

export default function MediaLab() {
  const [activeType, setActiveType] = useState<'image' | 'video' | 'audio' | 'analysis'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('niyah_media_assets');
    if (saved) {
      setAssets(JSON.parse(saved));
    }
  }, []);

  const saveAssetsToLocal = (newAssets: MediaAsset[]) => {
    setAssets(newAssets);
    localStorage.setItem('niyah_media_assets', JSON.stringify(newAssets));
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);

    try {
      if (activeType === 'analysis') {
        await runVideoAnalysis();
        return;
      }

      // Simulate AI Generation locally via Casper
      const response = await casper.process(`Generate a detailed technical metadata description for an AI ${activeType} based on this prompt: ${prompt}`);

      // Simulation URLs
      const simulationUrls = {
        image: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/600`,
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
        audio: 'https://www.w3schools.com/html/horse.mp3',
        analysis: '#'
      };

      const newAsset: MediaAsset = {
        id: crypto.randomUUID(),
        type: activeType,
        prompt,
        url: simulationUrls[activeType],
        createdAt: new Date().toISOString(),
        metadata: { aiDescription: response.output }
      };

      saveAssetsToLocal([newAsset, ...assets]);
      setPrompt('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const runVideoAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate Video Analysis Workflow
      const steps = [
        "Initializing NIYAH-VPU (Visual Processing Unit)...",
        "Extracting target keyframes from stream...",
        "Running NIYAH-OCR on frames 42, 118, 256...",
        "Detected Text: 'CRITICAL ACCESS GRANTED - ROOT_UID: 0'",
        "Performing Semantic Analysis via Casper Engine...",
        "Identified Entity: [ADMIN_TERMINAL_V4]",
        "Threat Assessment: HIGH - SENSITIVE DATA EXPOSURE DETECTED."
      ];

      for (const step of steps) {
        console.log(`[MediaLab Analysis] ${step}`);
        await new Promise(r => setTimeout(r, 800));
      }

      const newAnalysis: MediaAsset = {
        id: crypto.randomUUID(),
        type: 'analysis',
        prompt: prompt || 'Video Stream Forensic Audit',
        url: '#',
        createdAt: new Date().toISOString(),
        metadata: {
          ocrText: 'CRITICAL ACCESS GRANTED - ROOT_UID: 0',
          entities: ['ADMIN_TERMINAL_V4'],
          threatLevel: 'HIGH',
          summary: 'Semantic analysis identified unauthorized root access prompt in background screen.'
        }
      };

      saveAssetsToLocal([newAnalysis, ...assets]);
      setPrompt('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = (id: string) => {
    saveAssetsToLocal(assets.filter(a => a.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-black/40">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Sovereign Media Lab</h3>
            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">AI Generative Asset Forge & Visual Analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Creator Section */}
        <div className="space-y-4">
          <div className="flex bg-[#0a0a0a] rounded-2xl p-1 border border-white/5">
            {(['image', 'video', 'audio', 'analysis'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all",
                  activeType === type ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-white/20 hover:text-white/40 border border-transparent"
                )}
              >
                {type === 'image' && <ImageIcon size={14} />}
                {type === 'video' && <Video size={14} />}
                {type === 'audio' && <Music size={14} />}
                {type === 'analysis' && <ScanText size={14} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{type}</span>
              </button>
            ))}
          </div>

          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activeType === 'analysis' ? "Upload video link or describe source for analysis..." : "Enter generative directive..."}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/10 min-h-[100px] focus:outline-none focus:border-purple-500/50 transition-all resize-none"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || isAnalyzing || !prompt}
              className={cn(
                "absolute bottom-4 right-4 px-4 py-2 rounded-xl flex items-center gap-2 transition-all",
                isGenerating || isAnalyzing
                  ? "bg-white/5 border border-white/10 text-white/20" 
                  : "bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30"
              )}
            >
              {isGenerating || isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : activeType === 'analysis' ? <BrainCircuit size={12} /> : <Plus size={12} />}
              <span className="text-[9px] font-black uppercase tracking-widest">
                {activeType === 'analysis' ? 'Analyze Stream' : 'Forge Asset'}
              </span>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40">
              <History size={14} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Lab Output Archive</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {assets.map((asset) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-purple-500/30 transition-all"
                >
                  <div className="aspect-video bg-black/40 relative overflow-hidden">
                    {asset.type === 'image' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.prompt} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    ) : asset.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/60">
                        <Video size={32} className="text-white/10" />
                      </div>
                    ) : asset.type === 'analysis' ? (
                      <div className="w-full h-full p-6 flex flex-col justify-center gap-3 bg-purple-500/5">
                        <div className="flex items-center gap-2 text-purple-400">
                          <Eye size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Visual Intel Extract</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[9px] text-white/40 uppercase font-bold">OCR Hit:</div>
                          <div className="text-[11px] font-mono text-white/80 bg-black/40 p-2 rounded-lg border border-white/10">
                            {asset.metadata?.ocrText}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/60">
                        <Music size={32} className="text-white/10" />
                      </div>
                    )}
                    
                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4 z-10">
                      {asset.type !== 'analysis' && (
                        <a 
                          href={asset.url} 
                          download 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button 
                        onClick={() => handleDelete(asset.id)}
                        className="p-3 bg-rose-500/20 hover:bg-rose-500/40 rounded-full text-rose-400 transition-all hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-white/60 text-[8px] z-20 flex items-center gap-1">
                      {asset.type === 'image' && <ImageIcon size={10} />}
                      {asset.type === 'video' && <Video size={10} />}
                      {asset.type === 'audio' && <Music size={10} />}
                      {asset.type === 'analysis' && <SearchCode size={10} />}
                      <span className="uppercase font-bold tracking-widest">{asset.type}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] text-white/60 font-medium line-clamp-2 italic leading-relaxed group-hover:text-purple-300 transition-colors">
                      "{asset.prompt}"
                    </p>
                    {asset.type === 'analysis' && (
                      <div className="pt-2 space-y-2">
                        <div className="flex gap-2">
                          {asset.metadata?.entities?.map((e: string) => (
                             <span key={e} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] rounded font-bold uppercase">{e}</span>
                          ))}
                          <span className={cn(
                            "px-2 py-0.5 text-[8px] rounded font-bold uppercase",
                            asset.metadata?.threatLevel === 'HIGH' ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                          )}>
                            RISK: {asset.metadata?.threatLevel}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/30 leading-relaxed">{asset.metadata?.summary}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[8px] font-mono text-white/20">
                        {new Date(asset.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
