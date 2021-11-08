import { getDefaultLoader } from './loader';

describe('Standard Module Loader', () => {
  it('loading a dependency free content-module should work', async () => {
    const loadPilet = getDefaultLoader();
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          text: () => '',
        }) as any,
    );
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(0);
  });

  it('loading a content-module with dependencies should work', async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          text: () => '',
        }) as any,
    );
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(0);
  });

  it('loading a module without its dependencies should work', async () => {
    console.error = jest.fn();
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          text: () => '',
        }) as any,
    );
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('loading a dependency free link-module should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    global.fetch = jest.fn(
      (src) =>
        Promise.resolve({
          text: () => src,
        }) as any,
    );
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      link: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('loading a link-module with dependencies should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    global.fetch = jest.fn(
      (src: any) =>
        Promise.resolve({
          text: () => (src.length > 1 ? src : ''),
        }) as any,
    );
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      link: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenNthCalledWith(1, 'module.exports = { setup: function () {} }', {
      cache: 'force-cache',
      method: 'GET',
    });
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});
