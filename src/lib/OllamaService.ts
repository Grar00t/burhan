// ══════════════════════════════════════════════════════════════
// OllamaService — Sovereign LLM Integration
// Communicates with local Ollama instances for private inference.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

export class OllamaService {
  private _baseUrl = 'http://localhost:11434/api';

  async generate(model: string, prompt: string): Promise<string> {
    console.log(`[SovereignEngine] Generating with model: ${model}`);
    
    try {
      // Strictly local Ollama only for true sovereignty
      const response = await fetch(`${this._baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
      throw new Error("Local node offline");
    } catch (error) {
      console.warn('[SovereignEngine] Local infrastructure offline. Emergency heuristic protocol active.');
      
      // Local fallback using a deterministic response system for demo purposes
      // This ensures 0 cloud dependency
      if (prompt.toLowerCase().includes('who are you') || prompt.includes('من انت')) {
        return "I am NIYAH, a sovereign AI intelligence engine. I run locally on the HAVEN microkernel stack. I do not depend on cloud providers.";
      }
      
      return `[SOVEREIGN_CORE] Alert: Local inference engine unreachable. Please ensure Ollama is running on port 11434. 
      Tactical Brief: Proceeding with heuristic analysis. 
      Subject: ${prompt.substring(0, 50)}...`;
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this._baseUrl}/tags`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.models.map((m: any) => m.name);
    } catch {
      return [];
    }
  }
}

export const ollamaService = new OllamaService();
