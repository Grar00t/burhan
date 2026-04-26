import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Play, Pause, Music, Wind, Waves, Flame } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Sound {
  id: string;
  name: string;
  nameAr: string;
  icon: typeof Wind;
  url: string;
}

const sounds: Sound[] = [
  { id: 'white-noise', name: 'White Noise', nameAr: 'ضجيج أبيض', icon: Music, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'wind', name: 'Wind', nameAr: 'رياح', icon: Wind, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'waves', name: 'Waves', nameAr: 'أمواج', icon: Waves, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'fire', name: 'Fire', nameAr: 'نار', icon: Flame, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export function AmbientPlayer() {
  const { language } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Sound>(sounds[0]);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      
      const playMedia = async () => {
        if (isPlaying) {
          try {
            await audioRef.current?.play();
          } catch (err) {
            console.error("Playback failed:", err);
            setIsPlaying(false);
          }
        } else {
          audioRef.current?.pause();
        }
      };

      playMedia();
    }
  }, [isPlaying, volume, isMuted, currentSound]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 w-72"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <currentSound.icon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'ar' ? currentSound.nameAr : currentSound.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isPlaying ? (language === 'ar' ? 'يعمل الآن' : 'Playing Now') : (language === 'ar' ? 'متوقف' : 'Paused')}
              </p>
            </div>
          </div>
          <button 
            onClick={togglePlay}
            className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => setCurrentSound(sound)}
              className={`p-2 rounded-lg transition-all ${
                currentSound.id === sound.id 
                  ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={language === 'ar' ? sound.nameAr : sound.name}
            >
              <sound.icon size={18} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleMute} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <audio 
          ref={audioRef}
          src={currentSound.url}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      </motion.div>
    </div>
  );
}
