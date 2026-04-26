import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Send, 
  Sparkles, 
  Shield, 
  Lock, 
  Fingerprint, 
  Globe, 
  Terminal,
  Cpu,
  BrainCircuit,
  Zap,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Trash2,
  Paperclip as PaperclipIcon,
  Mic,
  MicOff,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { niyahEngine } from '../lib/NiyahEngine';
import { casper, CasperCapability } from '../lib/Casper';
import type { ChatMessage, ChatSession } from '../types';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

interface Message extends Omit<ChatMessage, 'timestamp'> {
  timestamp: string;
  groundingMetadata?: any;
  niyahResult?: any;
  agentResponse?: any;
  attachments?: any[];
}

const LOCAL_USER_ID = 'sovereign_operator_01';

export default function SovereignAIChat() {
  const { language } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info' } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or load session locally
  useEffect(() => {
    const initSession = async () => {
      try {
        const loadedSessions = await niyahEngine.loadChatSessions(LOCAL_USER_ID);
        setSessions(loadedSessions as any);
        
        if (!currentSessionId && loadedSessions.length > 0) {
          setCurrentSessionId(loadedSessions[0].id);
        } else if (!currentSessionId && loadedSessions.length === 0) {
          const newId = await createNewSession();
          setCurrentSessionId(newId);
        }
      } catch (err) {
        console.error("Error initializing local sessions:", err);
      }
    };

    initSession();
  }, []);

  // Listen for messages in current session locally
  useEffect(() => {
    if (!currentSessionId) return;

    const loadMessages = async () => {
      const loadedMessages = await niyahEngine.getSessionMessages(currentSessionId);
      setMessages(loadedMessages.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));
    };

    loadMessages();
  }, [currentSessionId]);

  const createNewSession = async () => {
    try {
      const newId = await niyahEngine.saveChatSession(LOCAL_USER_ID, 'New Sovereign Session', []);
      const loadedSessions = await niyahEngine.loadChatSessions(LOCAL_USER_ID);
      setSessions(loadedSessions as any);
      setCurrentSessionId(newId);
      setIsSessionListOpen(false);
      return newId;
    } catch (err) {
      console.error("Error creating new session:", err);
      return '';
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simplified local deletion
    const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
    const filtered = saved.filter((s: any) => s.id !== sessionId);
    localStorage.setItem('niyah_sessions', JSON.stringify(filtered));
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  const saveSessionTitle = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingTitle.trim()) return;
    
    const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
    const session = saved.find((s: any) => s.id === sessionId);
    if (session) {
      session.title = editingTitle;
      localStorage.setItem('niyah_sessions', JSON.stringify(saved));
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editingTitle } : s));
    }
    setEditingSessionId(null);
  };

  const handleSend = async () => {
    const sanitizedInput = input.trim();
    if (!sanitizedInput && attachments.length === 0) {
      setError({ message: "Command or attachment required.", type: 'warning' });
      return;
    }

    setError(null);
    setIsProcessing(true);
    const currentInput = sanitizedInput;
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);

    try {
      // Local processing
      const userMessage: any = {
        id: `msg-${Date.now()}`,
        sessionId: currentSessionId,
        role: 'user',
        content: currentInput || `Attached ${currentAttachments.length} tactical files.`,
        timestamp: new Date().toISOString(),
        attachments: currentAttachments.map(f => ({ name: f.name, size: f.size, type: f.type }))
      };

      setMessages(prev => [...prev, { ...userMessage, timestamp: new Date().toLocaleTimeString() }]);

      // Route through Casper
      const casperResponse = await casper.process(currentInput, currentSessionId || undefined);

      const aiMessage: any = {
        id: `msg-ai-${Date.now()}`,
        sessionId: currentSessionId,
        role: 'model',
        content: casperResponse.output,
        timestamp: new Date().toISOString(),
        niyahResult: casperResponse.niyahResult,
        agentResponse: casperResponse.agentResponse
      };

      setMessages(prev => [...prev, { ...aiMessage, timestamp: new Date().toLocaleTimeString() }]);
      
      // Update local storage
      if (currentSessionId) {
        const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
        const session = saved.find((s: any) => s.id === currentSessionId);
        if (session) {
          session.messages.push(userMessage, aiMessage);
          localStorage.setItem('niyah_sessions', JSON.stringify(saved));
        }
      }

    } catch (e: any) {
      console.error(e);
      setError({ message: "Sovereign Engine Error: Link severed or kernel panic.", type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const startEditingSession = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          setInput(transcript);
        };
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        setError({ message: "Speech recognition not supported in this browser.", type: 'warning' });
      }
    }
  };

  const GroundingSection = ({ metadata }: { metadata: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!metadata || !metadata.groundingChunks) return null;

    return (
      <div className="mt-4 border-t border-white/5 pt-3">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
        >
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Grounding Sources ({metadata.groundingChunks.length})
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                {metadata.groundingChunks.map((chunk: any, i: number) => (
                  <a 
                    key={i}
                    href={chunk.web?.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors group"
                  >
                    <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {chunk.web?.title || chunk.web?.uri}
                    </span>
                    <ExternalLink size={10} className="text-slate-600 group-hover:text-blue-400" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-8">
      {/* Chat Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-px bg-blue-500" />
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Sovereign Identity: COIN MAX</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              QUEEN <span className="text-blue-600 dark:text-blue-500">MAX v3.0</span>
            </h1>
            <div className="relative">
              <button 
                onClick={() => setIsSessionListOpen(!isSessionListOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-[10px] font-bold text-slate-700 dark:text-white uppercase tracking-widest"
              >
                Sessions ({sessions.length})
                <ChevronDown size={14} className={cn("transition-transform", isSessionListOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isSessionListOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                      {sessions.filter(s => !s.deleted).map((session) => (
                        <div key={session.id} className="group relative">
                          {editingSessionId === session.id ? (
                            <div className="flex items-center gap-2 p-2 bg-white/10 rounded-xl mb-1">
                              <input 
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className="flex-1 bg-transparent border-none text-[10px] text-white p-0 focus:ring-0"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex items-center gap-1">
                                <button onClick={(e) => saveSessionTitle(session.id, e)} className="text-emerald-500 hover:text-emerald-400">
                                  <Check size={12} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(null); }} className="text-rose-500 hover:text-rose-400">
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setCurrentSessionId(session.id);
                                setIsSessionListOpen(false);
                              }}
                              className={cn(
                                "w-full text-left p-3 rounded-xl transition-colors text-[10px] font-bold uppercase tracking-wider mb-1 pr-16",
                                currentSessionId === session.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                              )}
                            >
                              {session.title || 'Untitled Session'}
                              
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => startEditingSession(session, e)}
                                  className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-all shadow-lg"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button 
                                  onClick={(e) => deleteSession(session.id, e)}
                                  className="p-1.5 hover:bg-rose-500/20 rounded-lg text-slate-500 hover:text-rose-500 transition-all shadow-lg"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={createNewSession}
                      className="w-full p-4 bg-white/5 border-t border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]"
                    >
                      + New Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Local LLM Inference</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/20">
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">HAVEN Microkernel Sync</span>
            </div>
            {casper.getCapabilities().map((cap) => (
              <div key={cap} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 backdrop-blur-md">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Processing Mode</span>
            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">Sovereign Local Inference</span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
          <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-500" />
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 glass rounded-[48px] border-slate-200 dark:border-white/5 p-8 relative overflow-hidden flex flex-col shadow-2xl">
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] dark:opacity-[0.02]">
          <BrainCircuit size={400} className="text-slate-900 dark:text-white animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4 relative z-10">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-start gap-4 max-w-[80%]",
                  message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xl",
                  message.role === 'model' 
                    ? "bg-blue-600/10 text-blue-500 border-blue-500/20" 
                    : message.role === 'system'
                      ? "bg-rose-600/10 text-rose-500 border-rose-500/20"
                      : "bg-white/5 text-white border-white/10"
                )}>
                  {message.role === 'model' ? <Bot className="w-5 h-5" /> : message.role === 'system' ? <AlertTriangle className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className="space-y-2">
                  <div className={cn(
                    "p-5 rounded-3xl backdrop-blur-xl border shadow-2xl relative group",
                    message.role === 'model' 
                      ? "bg-blue-600/5 text-slate-900 dark:text-white border-blue-500/10 rounded-tl-none" 
                      : message.role === 'system'
                        ? "bg-rose-600/5 text-rose-600 dark:text-rose-500 border-rose-500/10 rounded-tl-none"
                        : "bg-white/5 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 rounded-tr-none"
                  )}>
                    {message.role === 'model' && (
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse blur-[2px]" />
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {message.attachments.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 text-[9px] text-slate-500 dark:text-white/40">
                            {file.type?.includes('image') ? <ImageIcon size={10} /> : <FileText size={10} />}
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-sm leading-relaxed font-medium prose prose-invert prose-blue max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-xl border border-white/5 my-4"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={cn("bg-white/10 rounded px-1.5 py-0.5 font-mono text-[0.9em]", className)} {...props}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.groundingMetadata && <GroundingSection metadata={message.groundingMetadata} />}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] block px-2",
                    message.role === 'user' ? "text-right" : ""
                  )}>
                    {message.timestamp} • {message.role === 'model' ? 'Verified Sovereign Response' : message.role === 'system' ? 'System Alert' : 'Encrypted User Input'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-8 relative z-10">
          {/* Attachment Preview */}
          <AnimatePresence>
            {attachments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 flex flex-wrap gap-2"
              >
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/60 group">
                    {file.type.startsWith('image/') ? <ImageIcon size={12} /> : <FileText size={12} />}
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button 
                      onClick={() => removeAttachment(i)}
                      className="p-1 hover:bg-rose-500/20 hover:text-rose-500 rounded transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "mb-4 p-4 rounded-2xl border flex items-center gap-3",
                  error.type === 'error' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                )}
              >
                <AlertTriangle size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{error.message}</span>
                {error.type === 'error' && (
                  <button 
                    onClick={() => handleSend()}
                    className="ml-auto p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <RefreshCw size={14} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isProcessing ? "Processing sovereign intent..." : "Enter sovereign command or query..."}
              disabled={isProcessing}
              className="w-full bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[32px] py-6 px-8 pl-16 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all backdrop-blur-2xl shadow-2xl disabled:opacity-50"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
              <button 
                onClick={handleFileClick}
                disabled={isProcessing}
                className="text-slate-600 hover:text-blue-500 transition-colors disabled:opacity-30"
              >
                <PaperclipIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleListening}
                disabled={isProcessing}
                className={cn(
                  "transition-colors disabled:opacity-30",
                  isListening ? "text-emerald-500 animate-pulse" : "text-slate-600 hover:text-emerald-500"
                )}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <Terminal className="w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />

            <button
              onClick={handleSend}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-6">
            {[
              { icon: Lock, label: 'Encrypted' },
              { icon: Zap, label: 'Local Inference' },
              { icon: Fingerprint, label: 'Sovereign ID' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-default">
                <item.icon className="w-3 h-3 text-slate-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
