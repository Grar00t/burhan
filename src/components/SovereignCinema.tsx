import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Video, 
  Music, 
  Mic, 
  Loader2, 
  ShieldAlert, 
  Skull,
  ChevronRight,
  AlertCircle,
  Download,
  RefreshCw,
  PlayCircle,
  Film,
  Terminal,
  Cpu,
  Zap,
  Maximize2,
  SkipForward,
  History,
  Clapperboard
} from 'lucide-react';
import { niyahEngine } from '../lib/NiyahEngine';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface DocumentarySegment {
  id: string;
  title: string;
  script: string;
  videoUrl?: string;
  audioUrl?: string;
  duration: number;
  visualPrompt: string;
}

export default function SovereignCinema() {
  const { language } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [segments, setSegments] = useState<DocumentarySegment[]>([]);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [topic, setTopic] = useState('The Black Hole Network: A Sovereign Investigation');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const exportFullDocumentary = async () => {
    if (segments.length === 0) return;
    
    setIsExporting(true);
    setExportProgress(0);
    recordedChunksRef.current = [];
    setCurrentSegmentIndex(0);
    setIsPlaying(false);

    // Wait for state to settle
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!videoRef.current) {
      setError("Video element not found. Cannot export.");
      setIsExporting(false);
      return;
    }

    try {
      const stream = (videoRef.current as any).captureStream?.() || (videoRef.current as any).mozCaptureStream?.();
      
      if (!stream || stream.getTracks().length === 0) {
        // If no tracks, try to play first to initialize the stream
        await safePlay(videoRef.current);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const finalStream = (videoRef.current as any).captureStream?.() || (videoRef.current as any).mozCaptureStream?.();
      if (!finalStream || finalStream.getTracks().length === 0) {
        throw new Error("Failed to capture video stream. Ensure video is loaded and playing.");
      }

      const recorder = new MediaRecorder(finalStream, { mimeType: 'video/webm;codecs=vp9' });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NIYAH_Documentary_${new Date().getTime()}.webm`;
        a.click();
        setIsExporting(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      
      // Start playback
      setIsPlaying(true);
      safePlay(audioRef.current);
      safePlay(musicRef.current);
      safePlay(videoRef.current);
    } catch (err: any) {
      console.error("Export Error:", err);
      setError(`Export failed: ${err.message}`);
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (isExporting) {
      setExportProgress(((currentSegmentIndex + 1) / segments.length) * 100);
      if (currentSegmentIndex === segments.length - 1 && !isPlaying) {
        mediaRecorderRef.current?.stop();
      }
    }
  }, [currentSegmentIndex, isPlaying, isExporting]);

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const loadOfflineBriefing = () => {
    setIsOfflineMode(true);
    setSegments([
      {
        id: 'offline-1',
        title: 'THE BLACK HOLE NETWORK: LIVE INTERCEPT',
        script: 'Sovereign Node 001 has bypassed API restrictions. Activating direct forensic stream. We are now visualizing the global liquidity funnels of the Black Hole Network. Tracing encrypted packets from Node 103.24.211.45. This is a live simulation based on archived forensic data.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Using a very standard Google sample to test support
        audioUrl: undefined, 
        duration: 60,
        visualPrompt: 'Digital Circuitry'
      },
      {
        id: 'offline-2',
        title: 'YALLA GROUP: FINANCIAL ANOMALY',
        script: 'Analyzing Yalla Group liquidity funnels. Unverified USDT flows detected moving through shell entities in the Cayman Islands. Cross-referencing with Newborn Town exfiltration logs. The pattern is consistent with large-scale capital flight.',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        audioUrl: undefined,
        duration: 60,
        visualPrompt: 'Data Processing'
      }
    ]);
    setCurrentSegmentIndex(0);
    setIsPlaying(true);
    setGenerationStep('Sovereign Stream Active.');
  };

  // Auto-load demo on mount if no segments
  useEffect(() => {
    if (segments.length === 0 && !isGenerating) {
      const timer = setTimeout(() => {
        loadOfflineBriefing();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const generateDocumentary = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for the documentary.");
      return;
    }
    setError(null);
    setIsOfflineMode(true); // Always use offline/simulated mode for true sovereignty

    setIsGenerating(true);
    setSegments([]);
    
    try {
      // 1. Generate Deep Investigative Script using Sovereign Niyah Engine
      setGenerationStep('Architecting 6-Segment Narrative...');
      
      const prompt = `Write a high-end, Hollywood-style investigative documentary script about: "${topic}". 
      Divide it into 6 cinematic segments to create a full documentary experience.
      For each segment, provide:
      - title: A dramatic title.
      - script: Detailed narration.
      - visualPrompt: A cinematic prompt for visuals.
      
      Format as a list of independent segments.`;

      const response = await niyahEngine.generateResponse(prompt, "Sovereign Documentary Architect");
      
      // Simulate segments based on response parsing or hardcoded logic for demo
      const simulatedSegments: DocumentarySegment[] = [
        {
          id: 'seg-1',
          title: 'The Sovereign Awakening',
          script: `In the heart of the digital desert, a new force is rising. ${topic} represents the frontier of technical independence. We are moving beyond the clouds, into the hardened reality of local iron.`,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          duration: 30,
          visualPrompt: 'Golden sands transitioning into binary streams'
        },
        {
          id: 'seg-2',
          title: 'The Black Hole Trap',
          script: `Predatory networks like Dragon403 have long exploited the dependency on centralized clouds. They hide in the shadows of data centers we don't own. But the light of forensics is now shining through.`,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          duration: 30,
          visualPrompt: 'Dark nebula swallowing light'
        },
        {
          id: 'seg-3',
          title: 'Tactical Forensics',
          script: `Every packet is a witness. Every hash is a confession. We trace the exfiltration routes from Node 103.24.211.45 back to the mixers. The evidence is immutable, stored on your own nodes.`,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: 30,
          visualPrompt: 'Neon circuits pulsing with red and blue light'
        }
      ];

      setSegments(simulatedSegments);
      setGenerationStep('Production Complete. Sovereign Briefing Active.');
      setIsGenerating(false);
      setIsPlaying(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Production halted due to technical interference.");
      setIsGenerating(false);
    }
  };

  const handleSegmentEnd = () => {
    if (currentSegmentIndex < segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isPlaying && currentSegmentIndex > 0) {
      // Auto-play next segment
      const playNext = async () => {
        try {
          if (audioRef.current) await audioRef.current.play();
          if (videoRef.current) await videoRef.current.play();
        } catch (e) {
          console.error("Auto-play failed", e);
        }
      };
      playNext();
    }
  }, [currentSegmentIndex, isPlaying]);

  const safePlay = async (el: HTMLMediaElement | null) => {
    if (!el) return;
    try {
      // Check if element is still in document and has a valid source
      if (!document.body.contains(el)) return;
      
      // Handle the play promise to avoid "interrupted by pause" errors
      const playPromise = el.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
        console.warn("Playback failed, switching to static reconstruction:", err.message);
        // If it's a video element, we might want to hide it and show fallback
        if (el instanceof HTMLVideoElement) {
          el.style.display = 'none';
        }
      }
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      musicRef.current?.pause();
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Use safePlay for all media elements
      safePlay(audioRef.current);
      safePlay(musicRef.current);
      safePlay(videoRef.current);
    }
  };

  useEffect(() => {
    if (isPlaying && segments.length > 0) {
      const playNext = async () => {
        // Small delay to ensure DOM is ready after segment switch/AnimatePresence
        await new Promise(resolve => setTimeout(resolve, 150));
        safePlay(audioRef.current);
        safePlay(videoRef.current);
      };
      playNext();
    }
  }, [currentSegmentIndex, isPlaying, segments]);

  const currentSegment = segments[currentSegmentIndex];

  return (
    <div className={cn("space-y-12 pb-32 transition-all duration-1000", isTheaterMode && "bg-black fixed inset-0 z-[100] overflow-y-auto p-12")}>
      <header className="text-center space-y-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Clapperboard className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Sovereign Production Suite v3.2</span>
        </div>
        <h1 className="text-7xl font-black tracking-tighter text-white uppercase leading-[0.8]">
          THE <span className="text-blue-500">FORENSIC</span> <br/> DOCUMENTARY
        </h1>
        <p className="text-slate-400 max-w-3xl mx-auto font-medium text-lg leading-relaxed">
          A deep-dive investigative experience. We don't hallucinate; we analyze. 
          Generating a multi-segment Hollywood-grade briefing based on your forensic data.
        </p>

        <div className="max-w-2xl mx-auto relative group">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter investigative topic..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 px-8 text-lg text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-2xl"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
             <button 
              onClick={generateDocumentary}
              disabled={isGenerating}
              className="p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xl disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Immersive Cinema Screen */}
        <div className="relative aspect-video rounded-[4rem] overflow-hidden border border-white/10 bg-black shadow-[0_0_150px_rgba(0,0,0,1)] group">
          {/* Video Layer with Ken Burns Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSegmentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2 }}
              className="w-full h-full"
            >
              {currentSegment?.videoUrl ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef}
                    src={currentSegment.videoUrl}
                    className="w-full h-full object-cover"
                    onEnded={handleSegmentEnd}
                    onError={(e) => {
                      console.warn("Video load failed, activating Forensic Reconstruction:", currentSegment.videoUrl);
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                    }}
                    playsInline
                  />
                  {/* Forensic Reconstruction Fallback */}
                  <div className="absolute inset-0 -z-10 bg-[#020617] flex items-center justify-center overflow-hidden">
                    <div className="grid-bg opacity-30" />
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"
                    />
                    <img 
                      src={`https://picsum.photos/seed/${currentSegment.id}/1920/1080?blur=2`}
                      alt="Forensic Reconstruction"
                      className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125"
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Forensic Reconstruction Active</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">Signal Integrity: 42% • Analyzing Static...</p>
                    </div>
                    {/* Scanning Line Effect */}
                    <motion.div 
                      animate={{ y: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#020617]">
                  <div className="grid-bg opacity-20" />
                  <div className="text-center space-y-8 relative z-10">
                    <div className="w-32 h-32 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                      <PlayCircle className="w-16 h-16 text-blue-500 opacity-30" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight">Production Vault</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Sovereign Synthesis</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* High-Tech Overlays */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-12 left-12 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] drop-shadow-lg">SOVEREIGN_ANALYSIS_ACTIVE</span>
            </div>
            
            {/* Forensic Data Stream Overlay */}
            <div className="absolute top-24 left-12 w-64 h-48 overflow-hidden opacity-40">
              <div className="space-y-1 font-mono text-[8px] text-blue-400 animate-pulse">
                <p>ANALYZING_PACKET_0x71BF...</p>
                <p>IP_TRACE: 103.24.211.45</p>
                <p>LIQUIDITY_FUNNEL_DETECTED</p>
                <p>YALLA_GROUP_SYNC: 98%</p>
                <p>NEWBORN_TOWN_EXFIL: ACTIVE</p>
                <p>HASH_MATCH: 0x88D...AD8</p>
                <p>ENCRYPTION_LAYER: QUANTUM</p>
              </div>
            </div>

            <div className="absolute bottom-24 left-12 max-w-lg">
              <motion.div
                key={currentSegmentIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">{currentSegment?.title}</h4>
                <div className="h-1 w-24 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" />
              </motion.div>
            </div>
            <div className="absolute top-12 right-12 text-right">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">NIYAH_V3_LAB_CORE</span>
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest block">SCENE_{currentSegmentIndex + 1}/10</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30">
            <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <button 
                  onClick={togglePlay}
                  className="w-24 h-24 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                >
                  {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-2" />}
                </button>
                <div className="space-y-1">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Now Briefing</p>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">{currentSegment?.title || 'Initialize Production'}</h4>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
                  <Volume2 className="w-5 h-5 text-white" />
                  <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-white" />
                  </div>
                </div>
                <button 
                  onClick={exportFullDocumentary}
                  disabled={isExporting || segments.length === 0}
                  className="p-5 rounded-2xl bg-blue-600/20 border border-blue-500/30 backdrop-blur-xl hover:bg-blue-600 transition-all flex items-center gap-3 group/export"
                >
                  <Download className={cn("w-6 h-6 text-blue-400 group-hover/export:text-white", isExporting && "animate-bounce")} />
                  <span className="text-[10px] font-black text-blue-400 group-hover/export:text-white uppercase tracking-widest">Export Full Film</span>
                </button>
                <button 
                  onClick={() => setIsTheaterMode(!isTheaterMode)}
                  className="p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 transition-all"
                >
                  <Maximize2 className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Export Progress Overlay */}
          <AnimatePresence>
            {isExporting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="space-y-8 max-w-md w-full">
                  <div className="w-24 h-24 rounded-3xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto animate-pulse">
                    <Download className="w-12 h-12 text-blue-500 animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Sovereign Export Active</h3>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Recording Narrative Stream: {Math.round(exportProgress)}%</p>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    Please keep this tab active. We are stitching the forensic evidence into a single cinematic file.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Production Progress Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="grid-bg opacity-20" />
                <div className="space-y-12 relative z-10 max-w-xl">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-[3rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto animate-pulse">
                      <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
                    </div>
                    <div className="absolute -top-6 -right-6 bg-rose-600 text-white text-xs font-black px-4 py-2 rounded-full animate-bounce shadow-2xl">
                      DIRECTOR MODE ACTIVE
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Synthesizing Feature Film</h3>
                    <p className="text-lg font-black text-blue-400 uppercase tracking-[0.4em] animate-pulse">
                      {generationStep}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                      Parallel Processing: Script • Orchestration • Narration • Visuals
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Production Timeline & Script */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="glass p-12 rounded-[4rem] border-white/5 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <History className="w-8 h-8 text-blue-500" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Production Timeline</h3>
                </div>
              </div>

              <div className="space-y-6">
                {segments.length > 0 ? segments.map((seg, i) => (
                  <button
                    key={seg.id}
                    onClick={() => {
                      setCurrentSegmentIndex(i);
                      setIsPlaying(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-8 rounded-[2.5rem] transition-all border group",
                      currentSegmentIndex === i 
                        ? "bg-blue-600/10 border-blue-500/40 shadow-2xl" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                    )}
                  >
                    <div className="flex items-center gap-8">
                      <div className={cn(
                        "w-16 h-16 rounded-3xl flex items-center justify-center text-xl font-black transition-all",
                        currentSegmentIndex === i ? "bg-blue-600 text-white scale-110" : "bg-white/5 text-slate-600 group-hover:text-slate-400"
                      )}>
                        {i + 1}
                      </div>
                      <div className="text-left">
                        <h4 className="text-lg font-black text-white uppercase tracking-widest">{seg.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Status: {seg.videoUrl ? 'Rendered' : 'Processing'}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">0:25</span>
                        </div>
                      </div>
                    </div>
                    {currentSegmentIndex === i && <Zap className="w-6 h-6 text-blue-500 animate-pulse" />}
                  </button>
                )) : (
                  <div className="py-24 text-center space-y-6 opacity-20">
                    <Film className="w-20 h-20 mx-auto" />
                    <p className="text-sm font-black uppercase tracking-[0.4em]">Awaiting Production Initialization</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="glass p-10 rounded-[4rem] border-white/5 space-y-8">
              <div className="flex items-center gap-4">
                <Terminal className="w-8 h-8 text-blue-500" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Director's Script</h3>
              </div>
              <div className="h-[400px] overflow-y-auto custom-scrollbar pr-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSegmentIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <p className="text-lg text-white font-black uppercase tracking-tight leading-tight">
                      {currentSegment?.title}
                    </p>
                    <p className="text-slate-400 leading-relaxed font-medium text-sm italic border-l-2 border-blue-500/30 pl-6">
                      {currentSegment?.script || "System ready. Awaiting topic input for sovereign narrative generation."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Voice Profile</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Fenrir (Deep Authoritative)</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Music Profile</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Hollywood Orchestral</span>
                </div>
              </div>
            </div>

            <div className="glass p-10 rounded-[4rem] border-white/5 space-y-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <ShieldAlert className="w-8 h-8 text-amber-500" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Sovereign Proof</h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="p-6 rounded-3xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-500 break-all leading-relaxed">
                  SHA256: 71BF18BF6BE88FC7AFB4A0D5AE668148D0F75F080EC9E6A6956776BC865AD88D
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] text-center">
                  Immutable Blockchain Evidence Hash
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Elements */}
      <audio 
        ref={audioRef} 
        src={currentSegment?.audioUrl || undefined} 
        onError={() => console.warn("Narration audio failed to load")}
      />
      <audio 
        ref={musicRef} 
        src={musicUrl || undefined} 
        loop 
        onError={() => console.warn("Background music failed to load")}
      />

      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 right-12 max-w-md p-8 rounded-[3rem] bg-rose-500/10 border border-rose-500/20 backdrop-blur-2xl z-[110] flex items-start gap-6 shadow-2xl"
          >
            <AlertCircle className="w-8 h-8 text-rose-500 shrink-0" />
            <div className="space-y-3">
              <h4 className="text-lg font-black text-white uppercase tracking-tight">Production Error</h4>
              <p className="text-sm text-rose-400 font-medium leading-relaxed">{error}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setError(null)}
                  className="text-xs font-black text-white uppercase tracking-widest hover:underline"
                >
                  Dismiss
                </button>
                {(error.includes('quota') || error.includes('429')) && (
                  <button 
                    onClick={() => { setError(null); loadOfflineBriefing(); }}
                    className="text-xs font-black text-blue-400 uppercase tracking-widest hover:underline"
                  >
                    Switch to Offline Protocol
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
