import { loadPilets, loadMetadata } from './load';

describe('Loading Modules', () => {
  it('Fetching from empty source without any other option works', async () => {
    const fetcher = jest.fn(() => Promise.resolve([]));
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
    const fetcher = jest.fn(() => Promise.resolve(apiResponse));
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
    const fetcher = jest.fn(() => Promise.resolve({} as any));
    await expect(loadPilets(fetcher, (m) => Promise.resolve<any>(m))).rejects.toThrowError(
      'The fetched pilets metadata is not an array.',
    );
  });
});
