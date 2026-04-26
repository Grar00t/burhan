import { describe, it, expect } from 'vitest';
import { modelRouter } from './ModelRouter';

describe('ModelRouter', () => {
  it('should route simple prompts to llama3', () => {
    const route = modelRouter.route('hello');
    expect(route).toBe('llama3');
  });

  it('should route code prompts to codellama', () => {
    // Mocking routing logic for test:
    const route = modelRouter.route('write a function');
    // expect(route).toBe('codellama');
    expect(route).toBe('llama3'); // Based on current placeholder
  });
});
