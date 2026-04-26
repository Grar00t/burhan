import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Shield, Zap, Activity, Radio } from 'lucide-react';
import { wsService } from '../lib/WebSocketService';
import { cn } from '../lib/utils';

interface FeedItem {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'engine';
  message: string;
  timestamp: string;
  payload?: any;
}

export const SovereignFeed = () => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = wsService.subscribe((data) => {
      let message = '';
      let type: FeedItem['type'] = 'info';
      
      if (data.type === 'NIYAH_ENGINE_MESSAGE' || data.type === 'NIYAH_HYBRID_OUTPUT') {
        type = 'engine';
        message = data.payload?.output || data.message;
      } else if (data.type === 'TRAINING_PROGRESS') {
        type = 'engine';
        message = `[TRAINING] Epoch ${data.epoch}: ${data.log || `Loss ${data.loss}`}`;
      } else if (data.type === 'TRAINING_INIT' || data.type === 'TRAINING_COMPLETE') {
        type = 'info';
        message = data.message;
      } else {
        message = typeof data === 'string' ? data : (data.payload?.output || data.message || JSON.stringify(data));
      }

      const newItem: FeedItem = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
        payload: data.payload
      };

      setItems(prev => [newItem, ...prev].slice(0, 50));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [items]);

  return (
    <div className="glass rounded-[40px] border-white/5 overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Sovereign Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            wsService.status === 'connected' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500"
          )} />
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
            {wsService.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
              <Terminal size={48} className="text-slate-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Sovereign Uplink...</p>
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-lg shrink-0 border",
                    item.type === 'engine' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    item.type === 'critical' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                    "bg-white/5 text-slate-400 border-white/10"
                  )}>
                    {item.type === 'engine' ? <Cpu size={14} /> : <Activity size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {item.type === 'engine' ? 'NIYAH CORE' : 'SYSTEM'} • {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-300 leading-relaxed break-words">
                      {item.message}
                    </p>
                    {item.payload?.intent && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">
                          Intent: {item.payload.intent}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest">
                          Conf: {(item.payload.confidence * 100).toFixed(1)}%
                        </span>
                        {item.payload.proof && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest font-mono">
                            Proof: {item.payload.proof.slice(0, 16)}...
                          </span>
                        )}
                        {item.payload.processingTime && (
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest">
                            {item.payload.processingTime}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
