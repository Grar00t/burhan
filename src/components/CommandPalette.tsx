import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Terminal, Shield, Zap, Settings, HelpCircle, X, ArrowRight, MessageCircle, Hammer, Cpu } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CommandItem {
  id: string;
  name: string;
  nameAr: string;
  icon: typeof Command;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const { language, setActiveTab, setNiyahMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    { id: 'dashboard', name: 'Open Dashboard', nameAr: 'فتح لوحة التحكم', icon: Command, shortcut: 'D', action: () => setActiveTab('dashboard') },
    { id: 'chat', name: 'Sovereign AI Chat', nameAr: 'دردشة الذكاء الاصطناعي', icon: MessageCircle, shortcut: 'C', action: () => setActiveTab('chat') },
    { id: 'phalanx', name: 'Phalanx Guardian', nameAr: 'حارس فالانكس', icon: Shield, shortcut: 'G', action: () => setActiveTab('phalanx') },
    { id: 'kspike', name: 'K-Spike Engine', nameAr: 'محرك كيه-سبايك', icon: Zap, shortcut: 'K', action: () => setActiveTab('kspike') },
    { id: 'kforge', name: 'K-Forge Repository', nameAr: 'مستودع كيه-فورج', icon: Hammer, shortcut: 'F', action: () => setActiveTab('kforge') },
    { id: 'ai', name: 'Niyah Engine', nameAr: 'محرك نية', icon: Cpu, shortcut: 'A', action: () => setActiveTab('ai') },
    { id: 'dinner', name: 'Sovereign Records', nameAr: 'السجلات السيادية', icon: Terminal, shortcut: 'R', action: () => { setActiveTab('ai'); setNiyahMode('dinner'); } },
    { id: 'settings', name: 'Settings', nameAr: 'الإعدادات', icon: Settings, shortcut: ',', action: () => setActiveTab('settings') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) || 
    cmd.nameAr.includes(search)
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(prev => !prev);
    }
    if (e.key === 'Escape') setIsOpen(false);

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
        setIsOpen(false);
      }
    }
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
              <Search className="text-slate-400" size={20} />
              <input 
                autoFocus
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={language === 'ar' ? 'ابحث عن أمر...' : 'Search for a command...'}
                className="w-full py-4 px-3 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400"
              />
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                <Command size={12} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">K</span>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      selectedIndex === idx 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <cmd.icon size={18} />
                      <span className="text-sm font-medium">
                        {language === 'ar' ? cmd.nameAr : cmd.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {cmd.shortcut && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-500">
                          {cmd.shortcut}
                        </span>
                      )}
                      {selectedIndex === idx && <ArrowRight size={14} />}
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center">
                  <HelpCircle size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                <div className="flex items-center gap-1">
                  <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">ESC</span>
                  <span>{language === 'ar' ? 'للإغلاق' : 'to close'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">↵</span>
                  <span>{language === 'ar' ? 'للاختيار' : 'to select'}</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 font-bold">
                HAVEN COMMANDS v1.0
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
