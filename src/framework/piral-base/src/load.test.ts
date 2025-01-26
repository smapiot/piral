import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { loadPilets, loadMetadata } from './load';

describe('Loading Modules', () => {
  it('Fetching from empty source without any other option works', async () => {
    const fetcher = vitest.fn(() => Promise.resolve([]));
    const result = await loadPilets(fetcher, (m) => Promise.resolve<any>(m));
    expect(result).toHaveLength(0);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('Fetching from empty source with existing cache works', async () => {
    const apiResponse = [
      {
        content: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        dependencies: {},
        hash: '1',
      },
    ];
    const fetcher = vitest.fn(() => Promise.resolve(apiResponse));
    const result = await loadPilets(fetcher as any, (m) => Promise.resolve<any>(m));
    expect(result).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('loadMetadata works with a valid requester', async () => {
    const pilets = await loadMetadata(() => Promise.resolve([{} as any]));
    expect(pilets.length).toBe(1);
  });

  it('loadMetadata uses fallback for invalid requester', async () => {
    const pilets = await loadMetadata([{}] as any);
    expect(pilets.length).toBe(0);
  });

  it('Fetching with non-array source yields error', async () => {
    const fetcher = vitest.fn(() => Promise.resolve({} as any));
    await expect(loadPilets(fetcher, (m) => Promise.resolve<any>(m))).rejects.toThrowError(
      'The fetched pilets metadata is not an array.',
    );
  });

  it('Fetching a non-array throws', async () => {
    const promise = loadMetadata(() => Promise.resolve({}) as any);
    expect(promise).rejects.toBeInstanceOf(Error);
  });

  it('Fetching with a standard array works', async () => {
    const data: any = {
      foo: 'bar',
    };
    const result = await loadMetadata(() => Promise.resolve([data]));
    expect(result).toEqual([
      {
        foo: 'bar',
      },
    ]);
  });

  it('Fetching with an immutable response works', async () => {
    const data: any = {
      foo: 'bar',
    };
    Object.preventExtensions(data);
    const result = await loadMetadata(() => Promise.resolve([data]));
    // @ts-ignore
    result[0].bar = 'qxz';
    expect(result).toEqual([
      {
        foo: 'bar',
        bar: 'qxz',
      },
    ]);
  });
});
