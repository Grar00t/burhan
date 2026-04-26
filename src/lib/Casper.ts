// ══════════════════════════════════════════════════════════════
// Casper Core — Sovereign General AI Client
// Handles multi-modal inputs, context management, and cross-agent orchestration.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

import { niyahEngine, NiyahResult } from './NiyahEngine';
import { ThreeLobeAgent, AgentResponse } from './ThreeLobeAgent';

export enum CasperCapability {
  NLP = 'NLP',
  CODE = 'CODE',
  VISION = 'VISION',
  FORENSICS = 'FORENSICS',
  DECENTRALIZED_GIT = 'DECENTRALIZED_GIT',
}

export interface CasperResponse {
  output: string;
  niyahResult: NiyahResult;
  agentResponse: AgentResponse;
}

export interface CasperSession {
  id: string;
  startTime: number;
  history: { role: 'user' | 'assistant'; content: string }[];
}

export class Casper {
  private _agent = new ThreeLobeAgent();
  private _sessions: Map<string, CasperSession> = new Map();

  async init(): Promise<void> {
    console.log('[Casper] Initializing general AI core...');
    await this._agent.init();
    await niyahEngine.init();
    console.log('[Casper] Core initialized and ready.');
  }

  async process(input: string, sessionId?: string): Promise<CasperResponse> {
    const id = sessionId || 'default';
    let session = this._sessions.get(id);
    if (!session) {
      session = { id, startTime: Date.now(), history: [] };
      this._sessions.set(id, session);
    }

    session.history.push({ role: 'user', content: input });

    // 1. Intent analysis via Niyah
    const niyahResult = await niyahEngine.process(input);
    console.log(`[Casper] Niyah intent: ${niyahResult.intentType}`);

    // 2. Process via ThreeLobeAgent
    const agentResponse = await this._agent.process(input);
    
    // 3. Update history
    session.history.push({ role: 'assistant', content: agentResponse.output });

    return {
      output: agentResponse.output,
      niyahResult,
      agentResponse
    };
  }

  getCapabilities(): CasperCapability[] {
    return [
      CasperCapability.NLP,
      CasperCapability.CODE,
      CasperCapability.VISION,
      CasperCapability.FORENSICS,
      CasperCapability.DECENTRALIZED_GIT,
    ];
  }
}

export const casper = new Casper();
