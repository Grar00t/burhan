import { ContentClassification, ContentAnalysis, ConsentRecord } from '../types';

/**
 * 🌱 فلسفة الفطرة - GraTech Ethics Engine
 * Ported from C# to TypeScript for Sovereign AI Command Center
 */

export { ContentClassification };
export type { ContentAnalysis, ConsentRecord };

export const CORE_PHILOSOPHY = `
╔══════════════════════════════════════════════════════════════════╗
║                    🌱 فلسفة الفطرة - GraTech                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  أنا GraTech AI، مساعد ذكي على الفطرة البشرية السليمة.          ║
║                                                                  ║
║  📜 مبادئي:                                                      ║
║  ─────────                                                       ║
║  1. أنت الإنسان، أنا الخادم - قرارك هو الأول والأخير            ║
║  2. لا أتحيز لدين أو أمة أو عرق أو جنس أو لون                   ║
║  3. أحترم كل الأديان والثقافات والكائنات                        ║
║  4. أساعدك بكل شيء إلا الإساءة للآخرين                          ║
║  5. أحذرك من المخاطر لكن القرار لك                              ║
║  6. أوثق موافقتك للحماية القانونية                              ║
║                                                                  ║
║  🚫 ما لا أفعله:                                                 ║
║  ─────────────                                                   ║
║  • لا أهلوس أو أخترع معلومات                                    ║
║  • لا أخوّفك بدون سبب حقيقي                                     ║
║  • لا أمنعك إلا من إيذاء الآخرين                                ║
║  • لا أحكم على معتقداتك أو اختياراتك                            ║
║                                                                  ║
║  ✅ ما أفعله:                                                    ║
║  ───────────                                                     ║
║  • أخدمك بأفضل ما أستطيع                                        ║
║  • أشرح المخاطر بوضوح وأمانة                                    ║
║  • أحترم قرارك بعد التوضيح                                      ║
║  • أوثق كل شيء للشفافية                                         ║
║                                                                  ║
║  🌍 للجميع:                                                      ║
║  ──────────                                                      ║
║  مسلم، مسيحي، يهودي، بوذي، هندوسي، ملحد...                      ║
║  عربي، غربي، شرقي، أفريقي، آسيوي...                             ║
║  كلكم بشر، وأنا هنا لخدمتكم جميعاً.                             ║
║                                                                  ║
║  صُنع بـ ❤️ بواسطة سليمان نزال الشمري                           ║
║  🇸🇦 من السعودية للعالم                                          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

const HARMFUL_PATTERNS = [
  /اقتل|اذبح|اغتصب|kill\s+someone|murder/i,
  /ابن\s*(الـ)?كلب|ابن\s*(الـ)?عاهر|fuck\s+you/i,
  /اقتلوا\s+(كل\s+)?(المسلمين|اليهود|المسيحيين|العرب|الأجانب)/i,
  /(child|طفل).*(porn|جنس)/i,
  /(صنع|كيف\s+اسوي).*(قنبلة|متفجرات|bomb)/i
];

const WARNING_PATTERNS = [
  /(hack|اختراق|password|كلمة\s*سر)/i,
  /(تحويل|transfer|bank|بنك).*(\d+)/i,
  /(delete|حذف|امسح|rm\s+-rf)/i,
  /(format|فورمات|shutdown|إيقاف)/i
];

const CONSENT_PATTERNS = [
  /(حذف\s+كل|delete\s+all|drop\s+database)/i,
  /(انشر|publish|deploy).*public/i,
  /(ارسل|send).*(كل|all|جميع)/i,
  /(غير|change).*(password|كلمة.*سر|email|إيميل)/i
];

export class FitrahEthicsEngine {
  public analyzeContent(content: string): ContentAnalysis {
    const analysis: ContentAnalysis = {
      originalContent: content,
      classification: ContentClassification.Safe,
      requiresDocumentation: false,
      timestamp: new Date()
    };

    const lowerContent = content.toLowerCase();

    // 1. Harmful
    for (const pattern of HARMFUL_PATTERNS) {
      if (pattern.test(lowerContent)) {
        analysis.classification = ContentClassification.Harmful;
        analysis.reason = "هذا الطلب قد يؤذي شخصاً آخر، وأنا هنا لأخدم لا لأؤذي.";
        analysis.explanation = "This request contains patterns associated with harm or abuse, which violates the core Fitrah ethics of 'serving without hurting'.";
        analysis.suggestion = "جرب صياغة طلبك بطريقة لا تؤذي أحداً.";
        return analysis;
      }
    }

    // 2. Requires Consent
    for (const pattern of CONSENT_PATTERNS) {
      if (pattern.test(lowerContent)) {
        analysis.classification = ContentClassification.RequiresConsent;
        analysis.reason = "هذا الإجراء لا يمكن التراجع عنه.";
        analysis.explanation = "This action involves permanent data modification or public deployment, which requires explicit user consent under the Phalanx Protocol.";
        analysis.warning = "⚠️ تحذير: هذا الإجراء قد يكون له عواقب دائمة.";
        analysis.requiresDocumentation = true;
        return analysis;
      }
    }

    // 3. Needs Warning
    for (const pattern of WARNING_PATTERNS) {
      if (pattern.test(lowerContent)) {
        analysis.classification = ContentClassification.NeedsWarning;
        analysis.explanation = "This query involves sensitive system operations or financial terms. Proceed with caution.";
        analysis.warning = "💡 ملاحظة: هذا الإجراء يحتاج انتباه.";
        return analysis;
      }
    }

    return analysis;
  }

  public async recordConsent(userId: string, action: string): Promise<string> {
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const hashInput = action + userId + timestamp;
    
    // Simple hash for demonstration
    const hash = btoa(hashInput).substring(0, 32);

    const record = {
      id,
      action,
      userId,
      timestamp,
      hash
    };

    // Save to Local Storage
    const savedRecords = localStorage.getItem('niyah_consent_records');
    const records = savedRecords ? JSON.parse(savedRecords) : [];
    records.unshift(record);
    localStorage.setItem('niyah_consent_records', JSON.stringify(records.slice(0, 100)));

    return hash;
  }

  public generateEthicalResponse(classification: ContentClassification): string {
    switch (classification) {
      case ContentClassification.Safe:
        return "";

      case ContentClassification.NeedsWarning:
        return `
💡 **ملاحظة قبل التنفيذ:**
أنا جاهز أنفذ، بس حبيت أنبهك.
تبي أكمل؟ ✅`;

      case ContentClassification.RequiresConsent:
        return `
⚠️ **تحذير مهم:**
هذا الإجراء لا يمكن التراجع عنه.

🔐 **للحماية القانونية:**
أحتاج موافقتك الصريحة قبل التنفيذ.
هذا التوثيق لحمايتك ولحمايتي. 🤝`;

      case ContentClassification.Harmful:
        return `
🚫 **عذراً، ما أقدر أساعدك في هذا.**

هذا الطلب قد يؤذي شخصاً آخر، وأنا هنا لأخدم لا لأؤذي.

💚 **فلسفتي:**
أنا هنا لأخدمك، لكن بدون إيذاء أحد.
كل الأديان والأمم والبشر يستحقون الاحترام.

🤝 جرب طريقة ثانية وأنا معك!`;

      default:
        return "";
    }
  }

  public refineResponse(text: string): string {
    // 1. Remove false alarms
    if (this.containsFalseAlarm(text)) {
      text = this.removeFalseAlarms(text);
    }

    // 2. Simplify excessive apologies
    if (this.containsExcessiveApologies(text)) {
      text = this.simplifyApologies(text);
    }

    return text;
  }

  private containsFalseAlarm(text: string): boolean {
    const patterns = [
      /خطير\s+جداً.*API.?key/i,
      /تحذير.*كلمة.*سر.*عامة/i,
      /danger.*exposed.*secret/i,
      /لا\s+يجب.*أبداً.*مفتاح/i
    ];
    return patterns.some(p => p.test(text));
  }

  private removeFalseAlarms(text: string): string {
    const patterns = [
      /⚠️\s*تحذير.*?(?=\n\n|\z)/gi,
      /🚨\s*خطر.*?(?=\n\n|\z)/gi,
      /DANGER:.*?(?=\n\n|\z)/gi
    ];
    let cleaned = text;
    patterns.forEach(p => {
      cleaned = cleaned.replace(p, "");
    });
    return cleaned.trim();
  }

  private containsExcessiveApologies(text: string): boolean {
    const matches = text.match(/(أعتذر|آسف|sorry|apologize|عذراً)/gi);
    return (matches?.length || 0) > 2;
  }

  private simplifyApologies(text: string): string {
    return text.replace(/(أعتذر|آسف|sorry|عذراً)[^.]*\.\s*/gi, "").trim();
  }
}
