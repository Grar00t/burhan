import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/niyah';
import { executeNiyahInference } from '../core/niyah-engine';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Cpu, Fingerprint } from 'lucide-react';

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 💀 Execute core inference (Bridged to lib/NiyahEngine)
      const response = await executeNiyahInference(input);
      
      const niyahMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'niyah',
        content: response.text,
        timestamp: Date.now(),
        metadata: response.metadata
      };

      setMessages(prev => [...prev, niyahMsg]);
    } catch (error) {
      console.error("[Chat] Inference failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col border-r border-[#00ffc8]/20 bg-[#0a0a0a] relative overflow-hidden h-full">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ffc8 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Message Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#00ffc8]/20"
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center opacity-30 mt-[-40px]"
            >
              <Terminal size={48} className="mb-4 text-[#00ffc8]" />
              <p className="text-sm font-mono tracking-widest uppercase">[ AWAITING_SOVEREIGN_INPUT ]</p>
            </motion.div>
          )}

          {messages.map(msg => {
            const isArabic = msg.metadata?.isArabic;
            const dir = isArabic ? 'rtl' : 'ltr';
            const align = msg.role === 'user' ? 'justify-end' : 'justify-start';
            const bg = msg.role === 'user' ? 'bg-[#00ffc8]/10' : 'bg-[#050505]';
            const border = msg.role === 'user' ? 'border-transparent' : 'border-[#00ffc8]/30';

            return (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${align} w-full`}
              >
                <div className={`max-w-[85%] p-4 rounded-xl border ${border} ${bg} shadow-2xl relative group overflow-hidden`}>
                  {/* Visual ID Marker */}
                  <div className={`absolute top-0 ${msg.role === 'user' ? 'right-0' : 'left-0'} w-1 h-full ${msg.role === 'user' ? 'bg-[#00ffc8]' : 'bg-[#ffc800]'} opacity-40`} />

                  <div className={`text-sm ${isArabic ? 'font-sans font-bold leading-relaxed' : 'font-mono'} text-slate-100 uppercase tracking-tight`} dir={dir}>
                    {msg.content}
                  </div>
                  
                  {/* ✦ Metadata Block */}
                  {msg.metadata && (
                    <div className="mt-4 pt-3 border-t border-[#00ffc8]/10 flex flex-wrap gap-4 text-[9px] font-black opacity-50 uppercase tracking-[0.2em]" dir="ltr">
                      <span className="flex items-center gap-1">
                        <Fingerprint size={10} className="text-[#00ffc8]" />
                        INTENT: {msg.metadata.intent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu size={10} className="text-[#00ffc8]" />
                        DIALECT: {msg.metadata.dialect}
                      </span>
                      <span className="flex items-center gap-1">
                        CONF: {(msg.metadata.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start w-full"
            >
              <div className="bg-[#050505] border border-[#00ffc8]/30 p-4 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00ffc8] animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-[#00ffc8]/60 uppercase">NIYAH THOUGHTS...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Input Area */}
      <div className="p-6 border-t border-[#00ffc8]/20 bg-[#050505] z-10">
        <div className="relative max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1 bg-[#0a0a0a] border border-[#00ffc8]/40 text-[#00ffc8] p-4 pr-12 focus:outline-none focus:border-[#00ffc8] font-mono placeholder-[#00ffc8]/20 uppercase text-xs tracking-widest rounded-xl transition-all disabled:opacity-50"
            placeholder={isLoading ? "[ PROCESSING_INFERENCE ]..." : "[ COMMAND_INPUT ]..."}
            dir="auto"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-[#00ffc8]/10 border border-[#00ffc8]/50 text-[#00ffc8] hover:bg-[#00ffc8]/20 transition-all rounded-xl disabled:opacity-30"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
