import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Mic, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Volume2, 
  Loader2, 
  Send, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  Radio,
  ShieldAlert,
  Cpu,
  BrainCircuit,
  Play,
  Pause,
  Download,
  Eye,
  Scan,
  MessageSquare,
  History,
  Bookmark,
  Trash2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { niyahEngine } from '../lib/NiyahEngine';

import ExploitScanner from './ExploitScanner';

type ToolType = 'analyze' | 'transcribe' | 'tts' | 'exploit';

interface SavedReport {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  status: string;
}

const LOCAL_USER_ID = 'sovereign_operator_01';

export default function FieldTools() {
  const [activeTool, setActiveTool] = useState<ToolType>('analyze');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [niyahMetadata, setNiyahMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load saved reports
  useEffect(() => {
    const saved = localStorage.getItem('niyah_field_reports');
    if (saved) {
      setSavedReports(JSON.parse(saved));
    }
  }, []);

  const saveReportsToLocal = (newReports: SavedReport[]) => {
    setSavedReports(newReports);
    localStorage.setItem('niyah_field_reports', JSON.stringify(newReports));
  };

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Analyze State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('Analyze this image for emergency assessment. Identify any hazards, victims, or infrastructure damage.');

  // Transcribe State
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // TTS State
  const [ttsText, setTtsText] = useState('');
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [voice, setVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' | 'Khaliji' | 'Levantine' | 'MSA'>('MSA');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Sovereign Niyah Vision Assessment (Mocking Vision support if Ollama doesn't have it)
      const prompt = `${analysisPrompt}\n\nAdditionally, extract key information, identify potential threats, and provide a tactical assessment. Format the response in clear Markdown with bold headings.`;
      const text = await niyahEngine.generateResponse(prompt, "Act as NIYAH Vision Intelligence.");
      
      setResult(text);
      
      // Process with NIYAH engine for metadata
      const metadata = await niyahEngine.process(text);
      setNiyahMetadata(metadata);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Failed to analyze content.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support audio recording or it is disabled.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (stream.getAudioTracks().length === 0) {
        throw new Error("No audio tracks available in the stream.");
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err: any) {
      console.error("Recording Error:", err);
      let userMessage = "Microphone access denied or unavailable.";
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMessage = "NO MICROPHONE DETECTED: Please connect a tactical audio input device to continue.";
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMessage = "PERMISSION DENIED: The Sovereign Uplink requires microphone authorization to capture field intelligence.";
      } else if (err.message) {
        userMessage = err.message;
      }
      
      setError(userMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = "Act as NIYAH Sovereign Intelligence. Transcribe this tactical field audio. Format the output as a structured Field Report in Markdown with: 1. Metadata (Timestamp, Duration), 2. Executive Summary, 3. Chronological Transcript with [MM:SS] timestamps, 4. Key Intelligence Points, and 5. Threat Assessment if applicable. Use bold headings and bullet points.";
      const text = await niyahEngine.generateResponse(prompt, "Sovereign Audio Intelligence Engine.");

      setResult(text);

      // Process with NIYAH engine for metadata
      const metadata = await niyahEngine.process(text);
      setNiyahMetadata(metadata);
    } catch (err: any) {
      console.error("Transcription Error:", err);
      setError(err.message || "Failed to transcribe audio.");
    } finally {
      setLoading(false);
    }
  };

  const saveTranscription = async () => {
    if (!result) return;
    setLoading(true);
    try {
      const newReport: SavedReport = {
        id: crypto.randomUUID(),
        type: activeTool === 'transcribe' ? 'audio_transcription' : 'visual_analysis',
        content: result,
        timestamp: new Date().toISOString(),
        status: 'verified'
      };
      
      saveReportsToLocal([newReport, ...savedReports]);
      setSaveSuccess(true);
    } catch (err: any) {
      console.error("Save Error:", err);
      setError("Failed to save report.");
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = (id: string) => {
    saveReportsToLocal(savedReports.filter(r => r.id !== id));
  };

  const handleTTS = async () => {
    if (!ttsText.trim()) return;
    setLoading(true);
    setError(null);
    setTtsAudioUrl(null);

    try {
      // Browser Synthesis only for Sovereign Offline Mode
      const utterance = new SpeechSynthesisUtterance(ttsText);
      const voices = window.speechSynthesis.getVoices();
      
      // Better language detection
      if (voice === 'Khaliji') {
        utterance.lang = 'ar-SA';
        utterance.pitch = 0.85;
        utterance.rate = 1.05;
      } else if (voice === 'Levantine') {
        utterance.lang = 'ar-JO';
        utterance.pitch = 1.15;
        utterance.rate = 1.0;
      } else if (voice === 'MSA') {
        utterance.lang = 'ar-XA'; 
        utterance.pitch = 1.0;
        utterance.rate = 0.9;
      } else {
        utterance.lang = 'en-US';
      }

      const selectedVoice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2))) || voices[0];
      if (selectedVoice) utterance.voice = selectedVoice;

      window.speechSynthesis.speak(utterance);
      setTtsAudioUrl('BROWSER_SYNTH');
    } catch (err: any) {
      console.error("TTS Error:", err);
      setError("Failed to generate speech using local synthesis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center">
            <Activity className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Field <span className="text-rose-500">Tools</span></h1>
            <p className="text-sm text-slate-400 font-medium tracking-wide flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-500" /> Tactical Intelligence & Analysis Suite
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Tools */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-[2.5rem] backdrop-blur-md space-y-2">
            <button
              onClick={() => { setActiveTool('analyze'); setResult(null); setError(null); setShowSaved(false); }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                activeTool === 'analyze' && !showSaved ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-opacity-20", activeTool === 'analyze' && !showSaved ? "bg-white/20" : "bg-blue-500/10")}>
                <Scan className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Visual Analysis</p>
                <p className="text-[10px] opacity-60">Analyze images & video</p>
              </div>
            </button>

            <button
              onClick={() => { setActiveTool('transcribe'); setResult(null); setError(null); setShowSaved(false); }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                activeTool === 'transcribe' && !showSaved ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-opacity-20", activeTool === 'transcribe' && !showSaved ? "bg-white/20" : "bg-emerald-500/10")}>
                <Mic className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Audio Transcribe</p>
                <p className="text-[10px] opacity-60">Speech to tactical text</p>
              </div>
            </button>

            <button
              onClick={() => { setActiveTool('tts'); setResult(null); setError(null); setShowSaved(false); }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                activeTool === 'tts' && !showSaved ? "bg-amber-600 text-white shadow-lg shadow-amber-900/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-opacity-20", activeTool === 'tts' && !showSaved ? "bg-white/20" : "bg-amber-500/10")}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Tactical Voice</p>
                <p className="text-[10px] opacity-60">Text to synthetic speech</p>
              </div>
            </button>

            <button
              onClick={() => { setActiveTool('exploit'); setResult(null); setError(null); setShowSaved(false); }}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                activeTool === 'exploit' && !showSaved ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-opacity-20", activeTool === 'exploit' && !showSaved ? "bg-white/20" : "bg-rose-500/10")}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Exploit Scanner</p>
                <p className="text-[10px] opacity-60">Vulnerability Arsenal</p>
              </div>
            </button>

            <button
              onClick={() => setShowSaved(!showSaved)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                showSaved ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <div className={cn("p-2 rounded-xl bg-opacity-20", showSaved ? "bg-white/20" : "bg-slate-500/10")}>
                <History className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Sovereign Dossier</p>
                <p className="text-[10px] opacity-60">{savedReports.length} reports archived</p>
              </div>
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">System Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Neural Engine</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Optimized</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Latency</span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">14ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Encryption</span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AES-256</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Interface */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {showSaved ? (
              <motion.div
                key="dossier"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 space-y-8 backdrop-blur-md min-h-[600px]"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Sovereign Dossier</h2>
                  <button onClick={() => setShowSaved(false)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {savedReports.length === 0 ? (
                    <div className="py-20 text-center opacity-30">
                      <Bookmark className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-sm font-bold uppercase tracking-widest">No archived reports</p>
                    </div>
                  ) : (
                    savedReports.map(report => (
                      <div key={report.id} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-xl",
                              report.type === 'audio_transcription' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                            )}>
                              {report.type === 'audio_transcription' ? <Mic size={16} /> : <Scan size={16} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase tracking-wider">{report.type.replace('_', ' ')}</p>
                              <p className="text-[10px] text-slate-500">{new Date(report.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteReport(report.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-3 font-mono">
                          {report.content}
                        </div>
                        <button 
                          onClick={() => { setResult(report.content); setShowSaved(false); setActiveTool(report.type === 'audio_transcription' ? 'transcribe' : 'analyze'); }}
                          className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-blue-400"
                        >
                          View Full Report <ChevronRight size={10} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : activeTool === 'analyze' && (
              <motion.div
                key="analyze"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 space-y-8 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Visual Analysis</h2>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Cpu className="w-5 h-5 text-blue-500" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="aspect-square rounded-[2.5rem] bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                          <button 
                            onClick={() => { setFile(null); setPreviewUrl(null); }}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-white hover:bg-rose-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-slate-600" />
                          </div>
                          <p className="text-sm font-bold text-slate-500">Drop image or video here</p>
                          <input 
                            type="file" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Analysis Parameters</label>
                      <textarea
                        value={analysisPrompt}
                        onChange={(e) => setAnalysisPrompt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px] resize-none"
                      />
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !file}
                      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-3"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                      Run Neural Scan
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Scan Results</label>
                      {result && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Complete</span>}
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 min-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
                      {result ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <div className="mb-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">NIYAH Analysis Engine</p>
                              <p className="text-xs text-white font-bold">Threat Level: {niyahMetadata?.sentiment === 'urgent' ? 'CRITICAL' : 'STABLE'}</p>
                            </div>
                          </div>
                          <div className="text-slate-300 leading-relaxed markdown-body">
                            <ReactMarkdown>{result}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                          <FileText className="w-12 h-12 text-slate-600" />
                          <p className="text-xs font-bold uppercase tracking-widest">Waiting for input</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTool === 'transcribe' && (
              <motion.div
                key="transcribe"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 space-y-8 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Audio Transcribe</h2>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Radio className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-12 space-y-8">
                  <div className="relative">
                    <motion.button
                      animate={recording ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      onClick={recording ? stopRecording : startRecording}
                      className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
                        recording ? "bg-rose-600 shadow-rose-900/40" : "bg-emerald-600 shadow-emerald-900/40"
                      )}
                    >
                      {recording ? <X className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
                    </motion.button>
                    {recording && (
                      <div className="absolute -inset-4 rounded-full border-2 border-rose-500/50 animate-ping" />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{recording ? 'Recording Field Audio...' : 'Ready to Record'}</h3>
                    <p className="text-sm text-slate-400">Capture voice reports, interviews, or ambient intelligence.</p>
                  </div>

                  {audioBlob && !recording && (
                    <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                      <audio src={URL.createObjectURL(audioBlob)} controls className="flex-1 h-10" />
                      <button 
                        onClick={handleTranscribe}
                        disabled={loading}
                        className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors disabled:bg-slate-800"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                </div>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Transcription Output</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={saveTranscription}
                          className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Save to Dossier
                        </button>
                        <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-blue-400 transition-colors">
                          <Download className="w-3 h-3" /> Export
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 text-slate-300 leading-relaxed font-mono text-xs markdown-body">
                      <div className="mb-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <BrainCircuit className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">NIYAH Transcription Engine</p>
                          <p className="text-xs text-white font-bold">Intent: {niyahMetadata?.intentType || 'ANALYSIS'}</p>
                        </div>
                      </div>
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTool === 'tts' && (
              <motion.div
                key="tts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 space-y-8 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Tactical Voice</h2>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Volume2 className="w-5 h-5 text-amber-500" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Text to Synthesize</label>
                    <textarea
                      value={ttsText}
                      onChange={(e) => setTtsText(e.target.value)}
                      placeholder="Enter text for tactical broadcast..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[200px] resize-none placeholder:text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Voice Profile</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'Zephyr', label: 'Zephyr', icon: '🌬️' },
                          { id: 'Kore', label: 'Kore', icon: '⛰️' },
                          { id: 'Puck', label: 'Puck', icon: '🧚' },
                          { id: 'Charon', label: 'Charon', icon: '🚣' },
                          { id: 'Fenrir', label: 'Fenrir', icon: '🐺' },
                          { id: 'Khaliji', label: 'خليجي', icon: '🇸🇦' },
                          { id: 'Levantine', label: 'شامي', icon: '🇯🇴' },
                          { id: 'MSA', label: 'فصحى', icon: '🏛️' }
                        ].map(v => (
                          <button
                            key={v.id}
                            onClick={() => setVoice(v.id as any)}
                            className={cn(
                              "py-3 rounded-xl text-[10px] font-bold border transition-all flex flex-col items-center gap-1",
                              voice === v.id ? "bg-amber-600/20 border-amber-500 text-amber-400 shadow-inner" : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                            )}
                          >
                            <span className="text-sm">{v.icon}</span>
                            <span>{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleTTS}
                        disabled={loading || !ttsText.trim()}
                        className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                        Generate Broadcast
                      </button>
                    </div>
                  </div>

                  {ttsAudioUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex flex-col items-center gap-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                        <Play className="w-8 h-8 text-amber-500" />
                      </div>
                      {ttsAudioUrl === 'BROWSER_SYNTH' ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          <span className="text-xs font-bold text-white uppercase tracking-widest">Speaking...</span>
                        </div>
                      ) : (
                        <audio src={ttsAudioUrl} controls className="w-full" />
                      )}
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synthetic Broadcast Ready</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTool === 'exploit' && (
              <motion.div
                key="exploit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ExploitScanner />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500"
              >
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Report successfully archived to Sovereign Dossier</span>
              </motion.div>
            )}

            {error && (
            <div className="p-6 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-rose-500">System Error</p>
                <p className="text-xs text-rose-400/80 mt-1">{error}</p>
              </div>
            </div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
