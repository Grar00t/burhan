import { describe, it, expect } from 'vitest';
import { NiyahEngine } from './NiyahEngine';

describe('NiyahEngine', () => {
  it('should detect intent and dialect correctly', async () => {
    const engine = new NiyahEngine();
    await engine.init();
    const result = await engine.process('شلونك يا خوارزم');
    expect(result.intent).toContain('شلونك');
    expect(result.dialect).toBe('najdi');
  });

  it('should detect domain correctly', async () => {
    const engine = new NiyahEngine();
    await engine.init();
    const result = await engine.process('write a code function');
    expect(result.domain).toBe('code');
  });
});
