import { getDefaultLoader } from './loader';

describe('Standard Module Loader', () => {
  it('loading a dependency free content-module should work', async () => {
    const dependencyRequest = jest.fn(() => Promise.resolve(''));
    const loadPilet = getDefaultLoader(() => ({}), dependencyRequest);
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
  });

  it('loading a content-module with dependencies should work', async () => {
    const dependencyRequest = jest.fn(() => Promise.resolve(''));
    const loadPilet = getDefaultLoader(() => ({}), dependencyRequest);
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
  });

  it('loading a module without its dependencies should work', async () => {
    console.error = jest.fn();
    const dependencyRequest = jest.fn(() => Promise.reject(''));
    const loadPilet = getDefaultLoader(() => ({}), dependencyRequest);
    const result = await loadPilet({
      content: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('loading a dependency free link-module should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const dependencyRequest = jest.fn((src) => Promise.resolve(src));
    const loadPilet = getDefaultLoader(() => ({}), dependencyRequest);
    const result = await loadPilet({
      link: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('loading a link-module with dependencies should work', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const dependencyRequest = jest.fn((src) => Promise.resolve(src.length > 1 ? src : ''));
    const loadPilet = getDefaultLoader(() => ({}), dependencyRequest);
    const result = await loadPilet({
      link: 'module.exports = { setup: function () {} }',
      name: 'mymodule',
      version: '1.0.0',
      hash: '1',
    });
    expect(result.setup).not.toBeUndefined();
    expect(dependencyRequest).toHaveBeenCalledTimes(1);
    expect(dependencyRequest).toHaveBeenNthCalledWith(1, 'module.exports = { setup: function () {} }');
    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});
