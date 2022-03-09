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
    const result = await loadPilets(fetcher, (m) => Promise.resolve<any>(m));
    expect(result).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('Fetching a non-array throws', async () => {
    const promise = loadMetadata(() => Promise.resolve({}) as any);
    expect(promise).rejects.toBeInstanceOf(Error);
  });

  it('Fetching with a standard array works', async () => {
    const data: any = {
      foo: 'bar',
    };
    const promise = loadMetadata(() =>
      Promise.resolve([data]),
    );
    expect(promise).rejects.toBeNull();
    const result = await promise;
    expect(result).toEqual([{
      foo: 'bar',
    }]);
  });

  it('Fetching with an immutable response works', async () => {
    const data: any = {
      foo: 'bar',
    };
    Object.preventExtensions(data);
    const promise = loadMetadata(() =>
      Promise.resolve([data]),
    );
    expect(promise).rejects.toBeNull();
    const result = await promise;
    // @ts-ignore
    result[0].bar = 'qxz'
    expect(result).toEqual([{
      foo: 'bar',
      bar: 'qxz',
    }]);
  });
});
