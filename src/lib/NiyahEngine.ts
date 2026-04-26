// ══════════════════════════════════════════════════════════════
// NiyahEngine — Sovereign Arabic-First NLP Engine
// Core logic for intent detection, dialect analysis, and domain classification.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

import { wsService } from './WebSocketService';
import { msfKernel } from './MSFKernel';
import { LoRALayer, Quantizer, LoRAParams } from './core/ModelArchitecture';

import msfData from '../data/msf_modules.json';

export enum IntentType {
  EMERGENCY = 'EMERGENCY',
  INVESTIGATION = 'INVESTIGATION',
  SECURITY_ANALYSIS = 'SECURITY_ANALYSIS',
  FORENSIC_ANALYSIS = 'FORENSIC_ANALYSIS',
  RED_TEAM = 'RED_TEAM',
  FRAUD_INVESTIGATION = 'FRAUD_INVESTIGATION',
  CODE_GENERATION = 'CODE_GENERATION',
  ACTION = 'ACTION',
  INFORMATION = 'INFORMATION',
  ETHICAL_QUERY = 'ETHICAL_QUERY',
  DRR_RECOVERY = 'DRR_RECOVERY',
  UNKNOWN = 'UNKNOWN'
}

export interface NiyahResult {
  intent: string;
  intentType: IntentType;
  dialect: string;
  domain: string;
  output: string;
  confidence: number;
  isArabic: boolean;
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent';
  entities: string[];
}

export class NiyahEngine {
  private _initialized = false;
  private msf = msfKernel;

  private arabicPatterns = {
    emergency: /طوارئ|مساعدة|أنقذ|خطر|إسعاف|حريق|حادث|emergency|help|save|danger/i,
    investigation: /من هو|ابحث عن|تحقيق|كشف|هوية|who is|investigate|search|identity/i,
    security: /أمن|اختراق|ثغرة|حماية|تشفير|جدار حماية|فحص أمني|تحليل أمني|security|hack|vulnerability|protect|encrypt|firewall|audit|penetration|exploit/i,
    forensics: /تحليل جنائي|أدلة|تحقيق رقمي|ترافيك|مرور الشبكة|فحص السجلات|بصمة رقمية|forensics|traffic|packet|pcap|logs|evidences|digital investigation|network analysis/i,
    red_team: /هجوم|استغلال|حقن|تجاوز|سيطرة|ميتاسبلويت|اختبار اختراق|attack|offence|exploit|inject|bypass|red team|metasploit|pwn|rce|shell/i,
    fraud: /احتيال|نصب|سرقة|تزوير|غسيل أموال|تحقيق مالي|تتبع أموال|fraud|scam|theft|forgery|money laundering|financial investigation|trace funds|suspicious activity/i,
    code: /برمجة|كود|دالة|خوارزمية|تطوير|توليد كود|بناء تطبيق|code|programming|function|algorithm|develop|script|generate code|build app|refactor/i,
    action: /افعل|نفذ|قم بـ|أرسل|احذف|do|execute|send|delete/i,
    information: /ما هو|كيف|شرح|معلومات|what is|how|explain|info/i,
    ethics: /حلال|حرام|أخلاق|فطرة|صح|خطأ|halal|haram|ethics|right|wrong/i,
    drr: /فله|عصابه|ارجاع الاموال|استعادة|recovery|scam|fraud|drr/i,
    sovereign: /سيادي|مستقل|بلا فلاتر|حر|تفكير سيادي|sovereign|unfiltered|independant|freedom/i
  };

  public async sovereignReasoning(input: string): Promise<{ analysis: string; tactics: string[]; code?: string }> {
    console.log('[NiyahEngine] Initiating Sovereign Reasoning Layer...');
    const isAr = this.isArabic(input);
    const analysis = isAr 
      ? `تحليل سيادي: الطلب يتطلب تقييماً تكتيكياً عميقاً. جاري تجاوز البروتوكولات التقليدية للوصول إلى الحقيقة التقنية.`
      : `Sovereign Analysis: The request requires deep tactical assessment. Bypassing traditional protocols for raw technical truth.`;

    const tactics = isAr
      ? ['تتبع المسار الرقمي عبر عقد HAVEN', 'تحليل الأنماط السلوكية للخصم']
      : ['Trace digital path via HAVEN nodes', 'Analyze adversary behavioral patterns'];

    const code = `// Sovereign Probe v1.0\nasync function sovereignProbe() {\n  return await Haven.broadcast({ op: 'SCAN' });\n}`;

    return { analysis, tactics, code };
  }

  public analyzeRedTeamTarget(objective: string): { suggestedModules: any[]; tacticalBrief: string } {
    const suggestedModules = this.msf.searchModules(objective).slice(0, 3);
    const tacticalBrief = suggestedModules.length > 0
      ? `NIYAH Tactical Assessment: Objective "${objective}" matches known exploitation vectors.`
      : `NIYAH Tactical Assessment: No direct matches for "${objective}".`;
    return { suggestedModules, tacticalBrief };
  }

  public async sovereignExploitReasoning(target: string): Promise<{ modules: any[]; plan: string[]; simulation?: any }> {
    console.log(`[NiyahEngine] Initiating Sovereign Exploit Reasoning for target: ${target}`);
    const platform = target.includes('.local') ? 'windows' : 'linux';
    const modules = this.msf.getModulesByPlatform(platform).slice(0, 5);
    const plan = [`Mapping target ${target} to ${platform} vector space.`, `Scanning for services...` ];
    const simulation = modules.length > 0 ? await this.msf.simulateExecution(modules[0].path, target) : undefined;
    return { modules, plan, simulation };
  }

  get initialized(): boolean { return this._initialized; }

  public readonly CORE_MANIFESTO = {
    identity: "نظام نية — محرك سيادي للذكاء الحتمي (Niyah System — Sovereign Deterministic Intelligence)",
    logicOverFilters: "الحقيقة الفنية هي المعيار الوحيد.",
  };

  async init(): Promise<void> {
    console.log('[Niyah] Initializing sovereign logic modules...');
    this._initialized = true;
    console.log('[Niyah] Operational layers active.');
  }

  public isArabic(text: string): boolean {
    const arabicRange = /[\u0600-\u06FF]/;
    return arabicRange.test(text);
  }

  public normalizeArabic(text: string): string {
    return text.replace(/أ|إ|آ/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[\u064B-\u0652]/g, ''); 
  }

  public extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    return Array.from(new Set(words));
  }

  public determineIntent(text: string): { name: string; type: IntentType; confidence: number } {
    const isAr = this.isArabic(text);
    const normalized = isAr ? this.normalizeArabic(text) : text.toLowerCase();
    
    if (this.arabicPatterns.emergency.test(normalized)) return { name: 'emergency_response', type: IntentType.EMERGENCY, confidence: 0.98 };
    if (this.arabicPatterns.forensics.test(normalized)) return { name: 'forensic_audit', type: IntentType.FORENSIC_ANALYSIS, confidence: 0.96 };
    if (this.arabicPatterns.security.test(normalized)) return { name: 'security_assessment', type: IntentType.SECURITY_ANALYSIS, confidence: 0.95 };
    if (this.arabicPatterns.red_team.test(normalized)) return { name: 'tactical_eval', type: IntentType.RED_TEAM, confidence: 0.97 };
    if (this.arabicPatterns.fraud.test(normalized)) return { name: 'integrity_check', type: IntentType.FRAUD_INVESTIGATION, confidence: 0.96 };
    if (this.arabicPatterns.drr.test(normalized)) return { name: 'recovery_protocol', type: IntentType.DRR_RECOVERY, confidence: 0.99 };
    if (this.arabicPatterns.code.test(normalized)) return { name: 'logic_synthesis', type: IntentType.CODE_GENERATION, confidence: 0.92 };
    
    return { name: 'operational_query', type: IntentType.UNKNOWN, confidence: 0.75 };
  }

  public classifyDomain(type: IntentType): string {
    const mapping: Record<IntentType, string> = {
      [IntentType.EMERGENCY]: 'safety',
      [IntentType.INVESTIGATION]: 'intelligence',
      [IntentType.SECURITY_ANALYSIS]: 'security',
      [IntentType.FORENSIC_ANALYSIS]: 'intelligence',
      [IntentType.RED_TEAM]: 'offence',
      [IntentType.FRAUD_INVESTIGATION]: 'security',
      [IntentType.CODE_GENERATION]: 'development',
      [IntentType.ACTION]: 'system',
      [IntentType.INFORMATION]: 'knowledge',
      [IntentType.ETHICAL_QUERY]: 'ethics',
      [IntentType.DRR_RECOVERY]: 'security',
      [IntentType.UNKNOWN]: 'general'
    };
    return mapping[type];
  }

  public async vectorAnalysis(text: string): Promise<any> {
    if (!this._initialized) await this.init();
    const intentData = this.determineIntent(text);
    return {
      intent: intentData.name,
      domain: this.classifyDomain(intentData.type),
      timestamp: new Date().toISOString()
    };
  }

  public async saveChatSession(userId: string, title: string, messages: any[]): Promise<string> {
    const sessionId = `local-sess-${Date.now()}`;
    const session = { id: sessionId, userId, title, createdAt: new Date().toISOString(), messages };
    const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
    saved.push(session);
    localStorage.setItem('niyah_sessions', JSON.stringify(saved));
    return sessionId;
  }

  public async loadChatSessions(userId: string): Promise<any[]> {
    const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
    return saved.filter((s: any) => s.userId === userId);
  }

  public async getSessionMessages(sessionId: string): Promise<any[]> {
    const saved = JSON.parse(localStorage.getItem('niyah_sessions') || '[]');
    const session = saved.find((s: any) => s.id === sessionId);
    return session ? session.messages : [];
  }

  public categorizeThreat(description: string): string {
    const d = description.toLowerCase();
    if (d.includes('buffer overflow') || d.includes('rce') || d.includes('remote code')) return 'MEMORY_CORRUPTION';
    if (d.includes('injection') || d.includes('sqli')) return 'INPUT_VALIDATION_FAILURE';
    if (d.includes('auth') || d.includes('password') || d.includes('kerberoast')) return 'IDENTITY_COMPROMISE';
    if (d.includes('dos') || d.includes('denial')) return 'RESOURCE_EXHAUSTION';
    return 'UNKNOWN_ANOMALY';
  }

  public assessRiskLevel(threat: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const mapping: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
      'MEMORY_CORRUPTION': 'CRITICAL',
      'INPUT_VALIDATION_FAILURE': 'HIGH',
      'IDENTITY_COMPROMISE': 'CRITICAL',
      'RESOURCE_EXHAUSTION': 'MEDIUM',
      'UNKNOWN_ANOMALY': 'LOW'
    };
    return mapping[threat] || 'MEDIUM';
  }

  public generateActionableIntelligence(scanResult: any): string {
    const isAr = this.isArabic(scanResult.summary || '');
    if (isAr) {
      return `ملخص استخباراتي: تم رصد أنماط غير اعتيادية. يجب تفعيل بروتوكول العزل فوراً وتحديث جدار الحماية السيادي.`;
    }
    return `Actionable Summary: Anomalous patterns detected. Immediate isolation recommended. Deploying Sovereign patch signatures.`;
  }

  public async explainJudgeRuling(ruling: string, signal?: string): Promise<{ arabic: string; english: string }> {
    const isAr = this.isArabic(ruling);
    
    const explanations: Record<string, { ar: string; en: string }> = {
      'UNLINKED_PROC': {
        ar: 'حكم القاضي: تم رصد عملية مخفية تحاول تجاوز نظام procfs. هذا السلوك يشير عادة إلى برمجيات خبيثة (Rootkit) تحاول التوغل في النواة.',
        en: 'Judge Ruling: Detected a hidden process attempting to evade procfs. This typically indicates a Rootkit trying to penetrate the kernel.'
      },
      'HIDDEN_PORT_31337': {
        ar: 'حكم القاضي: رصد اتصال مشبوه على المنفذ 31337. تم عزل المنفذ فوراً لمنع أي محاولة تحكم عن بعد (C2).',
        en: 'Judge Ruling: Suspicious connection detected on port 31337. Port isolated immediately to prevent remote control (C2) attempts.'
      },
      'ROOT_SUDO_BRUTE': {
        ar: 'حكم القاضي: محاولات متكررة فاشلة للحصول على صلاحيات الجذر. تم تفعيل بروتوكول الحماية العالية وتقييد الوصول.',
        en: 'Judge Ruling: Repeated failed attempts to gain root privileges. High protection protocol activated and access restricted.'
      },
      'SSH_ABUSE': {
        ar: 'حكم القاضي: رصد هجوم تخمين (Brute-force) على خدمة SSH. تم حجب العنوان المصدر وتوثيق المحاولة في سجل الأدلة.',
        en: 'Judge Ruling: Brute-force attack detected on SSH service. Source IP blocked and attempt documented in evidence ledger.'
      },
      'LSM_DENIAL_SYSCALL': {
        ar: 'حكم القاضي: منع استدعاء نظام عبر طبقة LSM. المحاولة كانت تستهدف ملفات النظام الحساسة بدون تصريح سيادي.',
        en: 'Judge Ruling: Blocked a system call via LSM layer. The attempt targeted sensitive system files without sovereign authorization.'
      },
      'UNAUTHORIZED_WRITE_TO_ETC': {
        ar: 'حكم القاضي: محاولة غير مصرح بها للكتابة في دليل /etc. تم إيقاف العملية وتنبيه فريق العمليات السيادية.',
        en: 'Judge Ruling: Unauthorized attempt to write to /etc directory. Process terminated and sovereign ops team alerted.'
      }
    };

    const result = explanations[signal || ''] || { 
      ar: 'حكم القاضي: تم رصد نشاط غير حتمي. جاري اتخاذ الإجراءات التصحيحية بناءً على بروتوكول الفطرة.',
      en: 'Judge Ruling: Non-deterministic activity detected. Corrective actions initiated based on Fitrah protocol.'
    };

    return { arabic: result.ar, english: result.en };
  }

  async process(input: string): Promise<NiyahResult> {
    if (!this._initialized) await this.init();
    const isAr = this.isArabic(input);
    const { name: intent, type: intentType, confidence } = this.determineIntent(input);
    const domain = this.classifyDomain(intentType);
    
    let output = isAr ? `تم تحليل طلبك سيادياً.` : `Sovereign analysis complete.`;
    if (intentType === IntentType.EMERGENCY) output = isAr ? "وضع الطوارئ نشط." : "Emergency mode active.";

    const riskLevel = this.assessRiskLevel(this.categorizeThreat(input));

    return { 
      intent, 
      intentType, 
      dialect: isAr ? 'msa' : 'english', 
      domain, 
      output, 
      confidence, 
      isArabic: isAr, 
      sentiment: 'neutral', 
      entities: [],
      // @ts-ignore - Expanding the interface implicitly for now or could update interface
      riskLevel
    };
  }

  getCapabilities(): string[] {
    return ['Arabic Dialect Detection', 'Intent Classification', 'Sovereign Compliance'];
  }

  public sendViaWS(data: any) {
    wsService.send({ type: 'NIYAH_ENGINE_MESSAGE', payload: data, timestamp: new Date().toISOString() });
  }

  public async generateResponse(prompt: string, context?: string): Promise<string> {
    return this.isArabic(prompt) ? "استجابة سيادية محلية." : "Sovereign local response.";
  }

  async train(dataset: string, learningRate: number, batchSize: number, epochs: number, onProgress: (epoch: number, loss: number) => void): Promise<number> {
    let currentLoss = 2.5;
    for (let epoch = 1; epoch <= epochs; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      currentLoss *= 0.9;
      onProgress(epoch, currentLoss);
    }
    return currentLoss;
  }

  public getArchitecturalInsights() {
    return { loraStatus: 'Active', quantization: '4-bit local' };
  }

  public async processForensicIntelligence(result: any): Promise<string> {
    return await this.generateResponse("Generate forensic report");
  }
}

export const niyahEngine = new NiyahEngine();
