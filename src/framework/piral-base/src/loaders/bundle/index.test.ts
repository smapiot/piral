import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import loader from './index';

vitest.mock('./dependency', () => ({
  includeBundle: vitest.fn((meta) =>
    meta.name === 'fail'
      ? Promise.reject('errored')
      : Promise.resolve({
          setup: vitest.fn(),
        }),
  ),
}));

describe('bundle loader module', () => {
  it('creates a fresh bundle that can load', async () => {
    const meta: any = {
      foo: 'bar',
    };
    const pilet: any = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('bar');
    pilet.setup({} as any);
  });

  it('creates a fresh bundle that fails loading', async () => {
    const meta: any = {
      foo: 'bar',
      name: 'fail',
    };
    const pilet: any = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('bar');
    pilet.setup({} as any);
  });
});
