// ══════════════════════════════════════════════════════════════
// ThreeLobeAgent — Sovereign Multi-Agent System
// Orchestrates local LLMs via Ollama and ModelRouter.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

import { ollamaService } from './OllamaService';
import { modelRouter, ModelType } from './ModelRouter';

export interface AgentResponse {
  agent: string;
  model: ModelType;
  output: string;
  timestamp: number;
}

export class ThreeLobeAgent {
  private _initialized = false;

  get initialized(): boolean { return this._initialized; }

  async init(): Promise<void> {
    console.log('[ThreeLobeAgent] Initializing sovereign multi-agent system...');
    this._initialized = true;
    console.log('[ThreeLobeAgent] Multi-agent system loaded successfully.');
  }

  async process(prompt: string): Promise<AgentResponse> {
    if (!this._initialized) await this.init();
    
    const model = modelRouter.route(prompt);
    console.log(`[ThreeLobeAgent] Routing to model: ${model}`);
    
    const output = await ollamaService.generate(model, prompt);
    const agent = 'haven_agent_01';
    const timestamp = Date.now();
    return { agent, model, output, timestamp };
  }
}
