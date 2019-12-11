import { loadModules } from './aggregate';
import { ArbiterModuleCache } from './types';

describe('Aggregating the modules', () => {
  it('Fetching from empty source without any other option works', async () => {
    const fetcher = jest.fn(() => Promise.resolve([]));
    const result = await loadModules(fetcher);
    expect(result).toHaveLength(0);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('Fetching from empty source with existing cache works', async () => {
    const originalCache = [];
    const apiResponse = [
      {
        content: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        dependencies: {},
        hash: '1',
      },
    ];
    const fetcher = jest.fn(() => Promise.resolve(apiResponse));
    const cache: ArbiterModuleCache = {
      retrieve: jest.fn(() => Promise.resolve(originalCache)),
      update: jest.fn((original, recv) => Promise.resolve([...original, ...recv])),
    };
    const result = await loadModules(fetcher, undefined, undefined, undefined, cache);
    expect(result).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cache.retrieve).toHaveBeenCalledWith();
    expect(cache.update).toHaveBeenCalledWith(originalCache, apiResponse);
  });
});
