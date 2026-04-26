import { niyahEngine, NiyahResult } from '../lib/NiyahEngine';
import { NiyahMetadata } from '../types/niyah';

export interface InferenceResponse {
  text: string;
  metadata: NiyahMetadata;
  msfIntelligence?: string[];
  exploitPlan?: {
    modules: any[];
    plan: string[];
    simulation?: any;
  };
}

/**
 * Bridges the UI requests to the Sovereign NiyahEngine (v3.0).
 * In a true FFI scenario, this would call out to the C11/C++20 kernel.
 */
export async function executeNiyahInference(input: string): Promise<InferenceResponse> {
  const result: NiyahResult = await niyahEngine.process(input);
  
  let exploitPlan;
  if (result.intentType === 'RED_TEAM' || input.toLowerCase().includes('exploit') || input.toLowerCase().includes('metasploit')) {
    exploitPlan = await niyahEngine.sovereignExploitReasoning(input);
  }

  return {
    text: result.output,
    metadata: {
      intent: result.intent,
      dialect: result.dialect,
      confidence: result.confidence,
      isArabic: result.isArabic
    },
    msfIntelligence: (niyahEngine as any).msf?.getUpgradeIntelligence(),
    exploitPlan
  };
}
