import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect } from 'vitest';
import loader from './index';

describe('empty loader module', () => {
  it('creates a new pilet with an empty setup function', async () => {
    const meta: any = {};
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('attaches new metadata that is decoupled', async () => {
    const meta: any = {
      foo: 'a',
    };
    const pilet: any = await loader(meta, {});
    meta.bar = 'b';
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('a');
    expect(pilet.bar).toBe(undefined);
    pilet.setup({} as any);
  });
});
