// ══════════════════════════════════════════════════════════════
// ModelRouter — Sovereign Model Orchestrator
// Routes prompts to the most appropriate local model.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

export enum ModelType {
  GENERAL = 'llama3',
  CODE = 'codellama',
  ARABIC = 'niyah-v3',
  SECURITY = 'phalanx-sec',
}

export class ModelRouter {
  route(prompt: string): ModelType {
    const lower = prompt.toLowerCase();
    
    // 1. Security/Forensics
    if (lower.includes('hack') || lower.includes('security') || lower.includes('forensic') || lower.includes('عصابه')) {
      return ModelType.SECURITY;
    }

    // 2. Code
    if (lower.includes('code') || lower.includes('function') || lower.includes('برمجة') || lower.includes('class')) {
      return ModelType.CODE;
    }

    // 3. Arabic-First (Niyah)
    if (/[\u0600-\u06FF]/.test(prompt)) {
      return ModelType.ARABIC;
    }

    // 4. Default
    return ModelType.GENERAL;
  }
}

export const modelRouter = new ModelRouter();
