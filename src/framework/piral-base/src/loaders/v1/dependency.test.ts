import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { includeDependency } from './dependency';

vitest.mock('../../utils', () => ({
  includeScript: vitest.fn(() => ({
    setup: vitest.fn(),
  })),
}));

describe('v1 dependency module', () => {
  it('creates a pure v1 using the setup function with a name', async () => {
    const meta: any = {
      name: 'my-pilet',
      foo: 'bar',
    };
    const pilet: any = await includeDependency(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });

  it('creates a pure v1 using the setup function without a name', async () => {
    const meta: any = {
      foo: 'bar',
    };
    const pilet: any = await includeDependency(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });
});
