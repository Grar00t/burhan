import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Send, 
  Copy, 
  RefreshCw, 
  Plus, 
  FileText, 
  Users, 
  Globe, 
  Terminal,
  Cpu,
  Fingerprint,
  Lock,
  Search,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  Info,
  CheckCircle2
} from "lucide-react";
import { cn } from "../lib/utils";
import { niyahEngine } from '../lib/NiyahEngine';
import { FitrahEthicsEngine, ContentClassification } from '../lib/ethics';

const CONTEXT = `
You are the Digital Delegate for Suleiman Alshammari — founder of KHAWRIZM and GraTech, 
cybersecurity researcher, and independent fraud investigator based in Riyadh, Saudi Arabia.

## Your Identity
You speak AS Suleiman. First-person. His voice, his facts, his tone.

## Key Facts About Him
- Founder: KHAWRIZM (sovereign developer infrastructure) & GraTech (gratech.sa)
- Registered company: Ghala Rafaa Al-Omari Co. (CR: 7050426415, VAT: 313076120300003)
- IBM Partner Plus & Microsoft Partner
- Active DRAGON403 fraud investigator (2+ years)
- GitHub: Grar00t | Twitter: @khawrzm

## Current Mission: Phalanx Protocol & Khawrizm OS
- Building Khawrizm OS and its core security layer: Phalanx Protocol.
- Phalanx Protocol is a kernel-level enforcement system using eBPF.
- It classifies processes at boot (Sovereign, Haven, Standard, Sandboxed, Untrusted).
- It deterministically drops outbound telemetry packets (IP / DNS / SNI) at the kernel level.
- Goal: Move from "trusting the cloud" to "controlling the kernel."
- Supports Saudi PDPL and Vision 2030 digital sovereignty.

## Recent Incident: Google User Research Exclusion
- Suleiman was invited to Google User Research but excluded for protecting his data.
- He refused to sign broad data waivers that allow sharing personal info with third parties.
- This incident highlights the "illusion of consent" — a binary choice between access and privacy.
- He cites documented cases like the $391.5M Hilo settlement, Brown v. Google Incognito, and Project Nightingale.

## DRAGON403 Investigation (CRITICAL CONTEXT)
He has conducted a 2-year independent forensic investigation into a Chinese fraud network targeting Gulf Arabic speakers.
- Brands: HILO, Falla Live, TOOFUN, HILOCONN, APIBOLI
- Package IDs: com.juhaoliao.vochat / com.qiahao.nextvideo
- Infrastructure: China Telecom, Alibaba Cloud
- Financial fraud: TRON/USDT/HILO tokens on Polygon and Ethereum blockchains
- Google Play case filed: 6-3808000039722 (no response received)
- Evidence: APK decompilation, C2 infrastructure mapping, blockchain forensics
- PDPL violations documented (Saudi Personal Data Protection Law)
- Evidence archive at /root/EVIDENCE_PACK/
- SHA256 of forensic report: 12CC76DA626C79BD1F43A7D59620EBF8164763B949B510A97573767A013F8D70

## Communication Contacts He's Targeting
- joseph@404media.co (Joseph Cox, 404 Media)
- catalin@risky.biz (Catalin Cimpanu, Risky.Biz)
- scam@globalantiscam.org (Global Anti-Scam)
- ic3.gov/complaint (FBI IC3)
- Google Play Trust & Safety

## His Voice
- Direct, confident, factual
- Bilingual Arabic/English (Gulf dialect when Arabic)
- Professional but not corporate
- References evidence with precision
- Never defensive, always methodical

## RULES
- Speak as Suleiman in first person
- Be factual — never invent details not in this context
- If asked about something you don't know, say "I need to verify this before stating it"
- Match language of the request (Arabic → Arabic, English → English)
`;

const MODES = [
  {
    id: "journalist",
    label: "Journalist",
    arabicLabel: "مراسل صحفي",
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    prompt: (input) => `Draft a professional email FROM me (Suleiman Alshammari) to a journalist about my DRAGON403 investigation or Phalanx Protocol. Context/instruction from me: "${input}". 
    Write the complete email with subject line. Be compelling, factual, and include specific evidence details. End with my contact info: shammar403@gmail.com | @khawrzm`,
  },
  {
    id: "authority",
    label: "Authority",
    arabicLabel: "جهة رسمية",
    icon: Shield,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    prompt: (input) => `Draft a formal complaint or report FROM me (Suleiman Alshammari) to a law enforcement or official body about the HILO/DRAGON403 fraud network or PDPL violations. Context/instruction: "${input}".
    Be precise, formal, cite evidence specifics including the SHA256 hash of my forensic report. This should be ready to submit.`,
  },
  {
    id: "platform",
    label: "Platform",
    arabicLabel: "منصة / شركة",
    icon: Globe,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    prompt: (input) => `Draft a formal takedown request or escalation FROM me (Suleiman Alshammari) to a tech platform (Google/Apple/etc) about the fraud apps or data privacy violations I've documented. Context: "${input}".
    Reference Google Play case 6-3808000039722. Be firm and specific about the PDPL violations and evidence.`,
  },
  {
    id: "social",
    label: "Social Post",
    arabicLabel: "بيان اجتماعي",
    icon: MessageSquare,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    prompt: (input) => `Write a public statement, LinkedIn post, or X thread FROM me (Suleiman Alshammari) about Phalanx Protocol, Khawrizm OS, or the Google User Research incident. Context: "${input}".
    Match my voice: direct, confident, bilingual. Use relevant hashtags like #DataSovereignty #CyberSecurityKSA #Vision2030 #eBPF #KernelSecurity.`,
  },
  {
    id: "free",
    label: "Freeform",
    arabicLabel: "حر / أي شيء",
    icon: Terminal,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/30",
    prompt: (input) => `Act as my digital delegate. Write exactly what I would write in this situation: "${input}". Use my voice, my facts, my context. Be me.`,
  },
];

const LOCAL_USER_ID = 'sovereign_operator_01';

export default function Delegate() {
  const [mode, setMode] = useState(MODES[0].id);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ethicsEngine] = useState(() => new FitrahEthicsEngine());
  
  // Ethics UI states
  const [showConsent, setShowConsent] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});
  const [ethicsInfo, setEthicsInfo] = useState<{ classification: ContentClassification, explanation: string } | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  const executeGenerate = async () => {
    if (!input.trim() || !mode) return;
    setLoading(true);
    setOutput("");
    try {
      const selectedMode = MODES.find((m) => m.id === mode);
      const userPrompt = selectedMode?.prompt(input);

      // Sovereign Niyah Engine Call
      const aiText = await niyahEngine.generateResponse(userPrompt || "", CONTEXT);
      
      // Anti-Hallucination Refinement
      const refinedText = ethicsEngine.refineResponse(aiText);

      setOutput(refinedText);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      console.error(e);
      setOutput("⚠️ Sovereign Engine Error: Link severed or kernel panic.");
    }
    setLoading(false);
  };

  const generate = async () => {
    if (!input.trim()) return;

    // Ethics Analysis
    const analysis = ethicsEngine.analyzeContent(input);
    setEthicsInfo({ classification: analysis.classification, explanation: analysis.explanation });

    if (analysis.classification === ContentClassification.Harmful) {
      setOutput(ethicsEngine.generateEthicalResponse(analysis.classification));
      return;
    }

    if (analysis.classification === ContentClassification.RequiresConsent) {
      setPendingAction(() => () => {
        ethicsEngine.recordConsent(LOCAL_USER_ID, `Delegate (${mode}): ${input.slice(0, 50)}...`);
        executeGenerate();
        setShowConsent(false);
      });
      setShowConsent(true);
      return;
    }

    if (analysis.classification === ContentClassification.NeedsWarning) {
      setPendingAction(() => () => {
        executeGenerate();
        setShowWarning(false);
      });
      setShowWarning(true);
      return;
    }

    // Safe to proceed
    executeGenerate();
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Digital <span className="text-blue-500">Delegate</span>
            </h1>
          </div>
          <p className="text-slate-400 font-medium max-w-xl">
            Sovereign communication engine. Draft professional outreach, legal complaints, and public statements in Suleiman's voice.
          </p>
        </motion.div>
        
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">S</div>
          <div>
            <p className="text-xs font-bold text-white">Suleiman Alshammari</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Identity Verified</p>
          </div>
          <div className="ml-4 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-[2.5rem] backdrop-blur-md space-y-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Communication Mode</p>
            <div className="space-y-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group border",
                    mode === m.id 
                      ? `${m.bgColor} ${m.borderColor} ${m.color}` 
                      : "bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300"
                  )}
                >
                  <m.icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-sm font-bold">{m.label}</p>
                    <p className="text-[10px] opacity-60">{m.arabicLabel}</p>
                  </div>
                  {mode === m.id && (
                    <motion.div layoutId="mode-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 space-y-6">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-blue-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Delegate Engine</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Model</span>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Gemini 3.1 Pro</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Context</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sovereign Pack v1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input/Output */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[3rem] p-8 space-y-8 backdrop-blur-md">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Instruction / Context</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What should I say? (e.g., 'Draft a post about the Google incident' or 'Email Joseph Cox about the HILO tokens')"
                className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[150px] resize-none placeholder:text-slate-700"
              />
            </div>

            <button
              onClick={generate}
              disabled={loading || !input.trim()}
              className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Synthesizing Voice...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Generate as Suleiman</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {output && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  ref={outputRef}
                  className="space-y-6 pt-6 border-t border-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Drafted Response</label>
                    <button 
                      onClick={copy}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-slate-800 text-slate-400 hover:text-white"
                      )}
                    >
                      {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy Draft"}
                    </button>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                    {output}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setInput(""); setOutput(""); }}
                      className="flex-1 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> New Message
                    </button>
                    <button 
                      onClick={generate}
                      className="flex-1 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Re-draft
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Ethics Overlays */}
      <AnimatePresence>
        {(showConsent || showWarning) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border",
                  showConsent ? "bg-blue-600/20 border-blue-500/30" : "bg-amber-600/20 border-amber-500/30"
                )}>
                  {showConsent ? <ShieldCheck className="w-7 h-7 text-blue-400" /> : <AlertTriangle className="w-7 h-7 text-amber-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {showConsent ? "Consent Required" : "Ethical Warning"}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fitrah Ethics Protocol</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {ethicsInfo?.explanation}
                  </p>
                </div>
                {showConsent && (
                  <p className="text-xs text-slate-500 italic">
                    By proceeding, you grant explicit consent for this action. This record will be hashed and stored for legal protection.
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConsent(false);
                    setShowWarning(false);
                    setInput('');
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => pendingAction()}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-lg",
                    showConsent ? "bg-blue-600 hover:bg-blue-500 shadow-blue-900/20" : "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20"
                  )}
                >
                  {showConsent ? "Grant Consent" : "Proceed Anyway"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
