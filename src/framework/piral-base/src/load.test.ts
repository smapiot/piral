import { loadPilet, loadPilets } from './load';

describe('Loading Modules', () => {
  it('loading a dependency free content-module should work', async () => {
    const dependencyRequest = jest.fn(() => Promise.resolve(''));
    const result = await loadPilet(
      {
        content: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        hash: '1',
      },
      () => ({}),
      dependencyRequest,
    );
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
  });

  it('loading a content-module with dependencies should work', async () => {
    const dependencyRequest = jest.fn(() => Promise.resolve(''));
    const result = await loadPilet(
      {
        content: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        hash: '1',
      },
      () => ({}),
      dependencyRequest,
    );
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
  });

  it('loading a module without its dependencies should work', async () => {
    console.error = jest.fn();
    const dependencyRequest = jest.fn(() => Promise.reject(''));
    const result = await loadPilet(
      {
        content: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        hash: '1',
      },
      () => ({}),
      dependencyRequest,
    );
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('loading a dependency free link-module should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const dependencyRequest = jest.fn(src => Promise.resolve(src));
    const result = await loadPilet(
      {
        link: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        hash: '1',
      },
      () => ({}),
      dependencyRequest,
    );
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('loading a link-module with dependencies should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const dependencyRequest = jest.fn(src => Promise.resolve(src.length > 1 ? src : ''));
    const result = await loadPilet(
      {
        link: 'module.exports = { setup: function () {} }',
        name: 'mymodule',
        version: '1.0.0',
        hash: '1',
      },
      () => ({}),
      dependencyRequest,
    );
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(1);
    expect(dependencyRequest).toHaveBeenNthCalledWith(1, 'module.exports = { setup: function () {} }');
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('Fetching from empty source without any other option works', async () => {
    const fetcher = jest.fn(() => Promise.resolve([]));
    const result = await loadPilets(fetcher);
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
    const result = await loadPilets(fetcher, undefined, undefined, undefined);
    expect(result).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
