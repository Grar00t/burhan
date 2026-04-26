import { create } from 'zustand';

interface UserProfile {
  id?: string;
  name?: string;
  avatar?: string;
  language: 'en' | 'ar';
  completedTutorial: boolean;
  theme: 'light' | 'dark';
}

interface StoreState {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showReport: boolean;
  setShowReport: (show: boolean) => void;
  selectedAIModel: 'niyah' | 'casper';
  setSelectedAIModel: (model: 'niyah' | 'casper') => void;
  niyahMode: 'inference' | 'training' | 'benchmark' | 'msf' | 'medialab' | 'dinner' | 'kspike';
  setNiyahMode: (mode: 'inference' | 'training' | 'benchmark' | 'msf' | 'medialab' | 'dinner' | 'kspike') => void;
  bypassAuth: boolean;
  setBypassAuth: (bypass: boolean) => void;
  profileId: string;
  setProfileId: (id: string) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  wathqApiKey: string;
  setWathqApiKey: (key: string) => void;
}

export const useIDEStore = create<StoreState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  activeTab: 'benchmarks',
  setActiveTab: (tab) => set({ activeTab: tab }),
  showReport: false,
  setShowReport: (show) => set({ showReport: show }),
  selectedAIModel: 'niyah',
  setSelectedAIModel: (model) => set({ selectedAIModel: model }),
  niyahMode: 'inference',
  setNiyahMode: (mode) => set({ niyahMode: mode }),
  bypassAuth: localStorage.getItem('niyah_bypass_auth') === 'true',
  setBypassAuth: (bypass) => {
    localStorage.setItem('niyah_bypass_auth', bypass ? 'true' : 'false');
    set({ bypassAuth: bypass });
  },
  profileId: 'default',
  setProfileId: (profileId) => set({ profileId }),
  profile: null,
  setProfile: (profile) => set({ profile }),
  showTutorial: false,
  setShowTutorial: (show) => set({ showTutorial: show }),
  wathqApiKey: localStorage.getItem('wathq_api_key') || '',
  setWathqApiKey: (key) => {
    localStorage.setItem('wathq_api_key', key);
    set({ wathqApiKey: key });
  },
}));

export const useStore = useIDEStore;
