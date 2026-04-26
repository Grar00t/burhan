import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  Database, 
  Cpu, 
  Zap, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Activity,
  Radio,
  Navigation,
  Sun,
  Moon,
  Plus,
  ArrowLeftRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

const SettingItem = ({ icon: Icon, label, value, color, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group",
      active 
        ? "bg-slate-800 dark:bg-slate-800 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
        : "bg-white/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/30 hover:bg-white dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700/50 shadow-sm dark:shadow-none"
    )}
  >
    <div className={cn("p-3 rounded-xl bg-opacity-10", color)}>
      <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
    </div>
    <div className="flex-1 text-left">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">{label}</p>
      {value && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{value}</p>}
    </div>
    <ChevronRight className={cn("w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors", active && "rotate-90 text-indigo-500 dark:text-indigo-400")} />
  </button>
);

export default function Settings() {
  const { language, setLanguage, profile, setProfile, theme, toggleTheme, profileId, setProfileId, setTheme } = useStore();
  const [profiles, setProfiles] = React.useState<any[]>([]);

  React.useEffect(() => {
    const savedProfiles = localStorage.getItem('niyah_user_profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    } else {
      // Initialize with default if none exist
      const defaultProfile = {
        id: 'p_01',
        name: 'Sovereign Operator',
        language: 'en',
        theme: 'dark',
        avatar: 'https://picsum.photos/seed/cyber1/200/200'
      };
      setProfiles([defaultProfile]);
      localStorage.setItem('niyah_user_profiles', JSON.stringify([defaultProfile]));
    }
  }, []);

  const handleSignOut = () => {
    // Local session termination
    localStorage.removeItem('niyah_auth_state');
    window.location.reload();
  };

  const updateProfileFields = (fields: any) => {
    const updatedProfiles = profiles.map(p => p.id === profileId ? { ...p, ...fields } : p);
    setProfiles(updatedProfiles);
    localStorage.setItem('niyah_user_profiles', JSON.stringify(updatedProfiles));
    if (profile) {
      setProfile({ ...profile, ...fields });
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    updateProfileFields({ language: newLang });
  };

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    toggleTheme();
    updateProfileFields({ theme: newTheme });
  };

  const createNewProfile = () => {
    const newId = `profile_${Date.now()}`;
    const newProfile = {
      id: newId,
      name: `Agent ${profiles.length + 1}`,
      language: 'en',
      theme: 'dark',
      completedTutorial: false,
      createdAt: new Date().toISOString()
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    localStorage.setItem('niyah_user_profiles', JSON.stringify(updated));
  };

  const switchProfile = (id: string) => {
    setProfileId(id);
    const selected = profiles.find(p => p.id === id);
    if (selected) {
      setProfile(selected);
      if (selected.language) setLanguage(selected.language);
      if (selected.theme) setTheme(selected.theme);
    }
  };

  const AVATARS = [
    'https://picsum.photos/seed/cyber1/200/200',
    'https://picsum.photos/seed/cyber2/200/200',
    'https://picsum.photos/seed/cyber3/200/200',
    'https://picsum.photos/seed/cyber4/200/200',
  ];

  const changeAvatar = (url: string) => {
    updateProfileFields({ avatar: url });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <User className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Profile <span className="text-indigo-500">Settings</span></h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">Manage your responder identity and system preferences.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 p-8 rounded-[3rem] text-center space-y-6 backdrop-blur-md shadow-xl dark:shadow-none">
            <div className="relative inline-block group">
              <img 
                src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name || 'Operator'}&background=random`} 
                className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-800 shadow-2xl mx-auto object-cover transition-transform group-hover:scale-105" 
                alt="Avatar"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-slate-50 dark:border-[#020617] flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{profile?.name || 'Sovereign Operator'}</h2>
              <p className="text-xs text-slate-500 font-medium">sovereign.local</p>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Select Tactical Avatar</p>
              <div className="flex justify-center gap-2">
                {AVATARS.map((url, i) => (
                  <button 
                    key={i}
                    onClick={() => changeAvatar(url)}
                    className={cn(
                      "w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110",
                      profile?.avatar === url ? "border-indigo-500 scale-110" : "border-transparent"
                    )}
                  >
                    <img src={url} className="w-full h-full object-cover" alt="Avatar choice" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20 uppercase tracking-widest">Active Duty</span>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-500 border border-indigo-500/20 uppercase tracking-widest">Lvl 4 Admin</span>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 space-y-6 shadow-lg dark:shadow-none">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-emerald-500" /> Profiles
              </h3>
              <button 
                onClick={createNewProfile}
                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {profiles.map(p => (
                <button 
                  key={p.id}
                  onClick={() => switchProfile(p.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between",
                    profileId === p.id 
                      ? "bg-slate-100 dark:bg-slate-800 border-indigo-500/50 text-indigo-600 dark:text-indigo-400" 
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">{p.name || p.id}</span>
                  {profileId === p.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-10">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">System Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingItem 
                icon={theme === 'dark' ? Moon : Sun} 
                label="System Appearance" 
                value={theme === 'dark' ? 'Stealth Mode (Dark)' : 'Illuminated (Light)'} 
                color={theme === 'dark' ? "bg-indigo-500" : "bg-amber-500"} 
                onClick={handleToggleTheme}
              />
              <SettingItem 
                icon={Globe} 
                label="System Language" 
                value={language === 'en' ? 'English (Global)' : 'Arabic (Sovereign)'} 
                color="bg-blue-500" 
                onClick={toggleLanguage}
              />
              <SettingItem 
                icon={Lock} 
                label="Security Protocol" 
                value="Phalanx v4.2" 
                color="bg-rose-500" 
              />
              <SettingItem 
                icon={Database} 
                label="Data Retention" 
                value="30 Days (Encrypted)" 
                color="bg-emerald-500" 
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">AI Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SettingItem 
                icon={Cpu} 
                label="Model Priority" 
                value="Gemini 3.1 Pro" 
                color="bg-indigo-500" 
              />
              <SettingItem 
                icon={Zap} 
                label="Thinking Mode" 
                value="High Intelligence" 
                color="bg-amber-500" 
              />
              <SettingItem 
                icon={Radio} 
                label="Voice Synthesis" 
                value="Zephyr (Tactical)" 
                color="bg-emerald-500" 
              />
              <SettingItem 
                icon={Navigation} 
                label="Grounding" 
                value="Search & Maps Active" 
                color="bg-blue-500" 
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Forensic API Configuration</h3>
            <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 p-6 rounded-3xl space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">WATHQ API (Commercial Registry)</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">Managed Investigation Key</p>
                </div>
              </div>
              <div className="relative group">
                <input 
                  type="password"
                  value={useStore.getState().wathqApiKey}
                  onChange={(e) => useStore.getState().setWathqApiKey(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-indigo-500 focus:border-indigo-500/50 outline-none transition-all"
                  placeholder="Enter WATHQ API Key..."
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-slate-400">
                  {useStore.getState().wathqApiKey ? 'ENCRYPTED_AT_REST' : 'NOT_CONFIGURED'}
                </div>
              </div>
              <p className="text-[9px] text-slate-500 italic leading-relaxed">
                Key is used only for K-SPIKE forensic lookups against the Saudi Commercial Registry. 
                Stored securely in the local sovereign session.
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-800/50">
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-sm hover:bg-rose-500/20 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
