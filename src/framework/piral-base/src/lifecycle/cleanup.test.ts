/**
 * @vitest-environment jsdom
 */
import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { prepareCleanup, runCleanup } from './cleanup';

describe('Cleaning up Modules', () => {
  it('cleans up stylesheet if available', () => {
    const remove = vitest.fn();
    document.querySelector = vitest.fn(() => ({ remove }));
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {},
    );
    expect(document.querySelector).toHaveBeenCalledWith('link[data-origin="my-pilet"]');
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('discards stylesheet if not available', () => {
    document.querySelector = vitest.fn(() => null);
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {},
    );
    expect(document.querySelector).toHaveBeenCalledWith('link[data-origin="my-pilet"]');
  });

  it('runs teardown if available', () => {
    document.querySelector = vitest.fn(() => null);
    const teardown = vitest.fn();
    runCleanup(
      {
        name: 'my-pilet',
        teardown,
      } as any,
      {} as any,
      {},
    );
    expect(teardown).toHaveBeenCalled();
  });

  it('runs cleanupPilet hook if available', () => {
    document.querySelector = vitest.fn(() => null);
    const cleanupPilet = vitest.fn();
    runCleanup(
      {
        name: 'my-pilet',
      } as any,
      {} as any,
      {
        cleanupPilet,
      },
    );
    expect(cleanupPilet).toHaveBeenCalled();
  });

  it('deletes require reference if available', () => {
    document.querySelector = vitest.fn(() => null);
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    window['abc'] = pilet;
    runCleanup(pilet, {} as any, {});
    expect(window['abc']).toBeUndefined();
  });

  it('prepares the cleanup', () => {
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    const api: any = {
      on: vitest.fn(),
      off: vitest.fn(),
    };
    prepareCleanup(pilet, api, {});
    expect(api.on).toBeCalledWith('unload-pilet', expect.anything());
  });

  it('prepared cleanup function has handler that is sensitive to the name', () => {
    document.querySelector = vitest.fn(() => null);
    const pilet: any = {
      name: 'my-pilet',
      requireRef: 'abc',
    };
    let handler = undefined;
    const api: any = {
      on: vitest.fn((evtName, cb) => (handler = cb)),
      off: vitest.fn(),
    };
    prepareCleanup(pilet, api, {});
    expect(api.on).toBeCalledWith('unload-pilet', handler);
    handler({ name: 'foo' });
    expect(api.off).not.toBeCalled();
    handler({ name: pilet.name });
    expect(api.off).toBeCalledWith('unload-pilet', handler);
  });
});
