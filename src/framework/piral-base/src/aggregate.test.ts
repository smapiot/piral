import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { runPilet } from './aggregate';

describe('Piral-Base aggregate module', () => {
  it('createPilet calls the setup method of the pilet', async () => {
    const create: any = vitest.fn(() => ({
      on: vitest.fn(),
      off: vitest.fn(),
    }));
    const setup = vitest.fn();
    await runPilet(
      create,
      {
        name: 'any',
        version: '1.0.0',
        hash: '123',
        setup,
      } as any,
      {},
    );
    expect(create).toBeCalled();
    expect(setup).toBeCalled();
  });

  it('createPilet does not call due to invalid api creator', async () => {
    const setup = vitest.fn();
    await runPilet(
      undefined,
      {
        name: 'any',
        version: '1.0.0',
        hash: '123',
        setup: 5 as any,
      } as any,
      {},
    );
    expect(setup).not.toBeCalled();
  });
});
