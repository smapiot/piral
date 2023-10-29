import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { includeBundle } from './dependency';

vitest.mock('../../utils', () => ({
  includeScript: vitest.fn(() => ({
    setup: vitest.fn(),
  })),
}));

describe('bundle dependency module', () => {
  it('creates a pure bundle using the setup function with a name', async () => {
    const meta: any = {
      name: 'my-pilet',
      foo: 'bar',
    };
    const pilet: any = await includeBundle(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });

  it('creates a pure bundle using the setup function without a name', async () => {
    const meta: any = {
      foo: 'bar',
    };
    const pilet: any = await includeBundle(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });
});
