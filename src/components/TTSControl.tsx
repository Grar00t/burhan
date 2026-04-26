import React, { useState, useRef } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Settings2,
  Mic,
  Globe,
  MoreVertical,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface VoiceProfile {
  id: string;
  name: string;
  dialect: string;
  gender: 'M' | 'F';
  accent: string;
}

const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'ar-sa-1', name: 'Zaid', dialect: 'Saudi (Najdi)', gender: 'M', accent: 'Professional' },
  { id: 'ar-sa-2', name: 'Laila', dialect: 'Saudi (Hijazi)', gender: 'F', accent: 'Natural' },
  { id: 'ar-eg-1', name: 'Omar', dialect: 'Egyptian', gender: 'M', accent: 'Authoritative' },
  { id: 'ar-ma-1', name: 'Karim', dialect: 'Maghrebi', gender: 'M', accent: 'Local' },
  { id: 'en-us-1', name: 'Sovereign', dialect: 'English (US)', gender: 'M', accent: 'Monotone/AI' },
];

export const TTSControl = ({ initialText = '' }: { initialText?: string }) => {
  const [text, setText] = useState(initialText);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  const speak = () => {
    if (!text) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Note: Browser support for specific Arabic dialects varies. 
    // In a real app, we'd use a dedicated TTS API like Google Cloud TTS or Niyah's local TTS.
    // For this sovereign demo, we use the browser's Synthesis with custom styling.
    
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.lang = selectedVoice.id.split('-').slice(0, 2).join('-');
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Volume2 className="text-blue-500" size={18} />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Sovereign Vocal Synthesizer</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSpeaking && <Activity size={14} className="text-blue-500 animate-pulse" />}
          <div className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">NIYAH_VOICE_CORE_v2</div>
        </div>
      </div>

      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text for vocal synthesis..."
        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all resize-none font-sans"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
            <Globe size={12} /> Select Voice Profile
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
            {VOICE_PROFILES.map((voice) => (
              <button
                key={voice.id}
                onClick={() => setSelectedVoice(voice)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                  selectedVoice.id === voice.id 
                    ? "bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20" 
                    : "bg-white/5 border-white/5 hover:border-white/10"
                )}
              >
                <div>
                  <div className="text-[10px] font-bold text-white">{voice.name}</div>
                  <div className="text-[8px] text-white/40">{voice.dialect}</div>
                </div>
                <div className="text-[8px] font-mono text-white/20">{voice.accent}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
            <Settings2 size={12} /> Synthesis modulation
          </div>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase">
                <span>Pitch</span>
                <span className="text-blue-500">{pitch.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0.5" max="2" step="0.1" 
                value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase">
                <span>Speed</span>
                <span className="text-blue-500">{rate.toFixed(1)}x</span>
              </div>
              <input 
                type="range" min="0.5" max="2" step="0.1" 
                value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-3">
        <button 
          onClick={isSpeaking ? stop : speak}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            isSpeaking 
              ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30" 
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          )}
        >
          {isSpeaking ? <Pause size={16} /> : <Play size={16} />}
          {isSpeaking ? 'Abort Synthesis' : 'Generate Vocal Output'}
        </button>
        <button className="p-4 bg-white/5 border border-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
          <Mic size={16} />
        </button>
      </div>
    </div>
  );
};
