/**
 * @vitest-environment jsdom
 */
import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { getDefaultLoader, extendLoader } from './loader';

describe('Standard Module Loader', () => {
  it('loading a dependency free v2 pilet should work', async () => {
    const loadPilet = getDefaultLoader();
    System.import = vitest.fn(() => Promise.resolve({ setup: vitest.fn() })) as any;
    const result = await loadPilet({
      name: 'mymodule',
      version: '1.0.0',
      link: 'foo',
      spec: 'v2',
    });
    expect(result.setup).not.toBeUndefined();
  });

  it('loading a dependency free v1 pilet should work', async () => {
    const mockScript: any = {
      app: {
        setup: vitest.fn(),
      },
    };
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      name: 'mymodule',
      version: '1.0.0',
      link: 'foo',
      requireRef: 'abc',
      spec: 'v1',
    });
    expect(result.setup).not.toBeUndefined();
  });

  it('loading a dependency free bundle pilet should work', async () => {
    const mockScript: any = {
      app: {
        setup: vitest.fn(),
      },
    };
    document.createElement = vitest.fn(() => mockScript);
    document.body.appendChild = vitest.fn(() => mockScript.onload());
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      name: 'mymodule',
      version: '1.0.0',
      link: 'foo',
      bundle: 'abc',
    });
    expect(result.setup).not.toBeUndefined();
  });

  it('loading an invalid/unknown pilet should fall back to the empty module', async () => {
    const loadPilet = getDefaultLoader();
    const result = await loadPilet({
      name: 'mymodule',
      version: '1.0.0',
      spec: 'v100',
    });
    expect(result.setup).not.toBeUndefined();
  });

  it('loading a dependency free content-module should work', async () => {
    const loadPilet = getDefaultLoader();
    global.fetch = vitest.fn(
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
    global.fetch = vitest.fn(
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
    console.error = vitest.fn();
    global.fetch = vitest.fn(
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
    console.error = vitest.fn();
    console.warn = vitest.fn();
    global.fetch = vitest.fn(
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
    console.error = vitest.fn();
    console.warn = vitest.fn();
    global.fetch = vitest.fn(
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

  it('extendLoader does not require custom spec loaders', async () => {
    const fallback = vitest.fn();
    const fooLoader = vitest.fn();
    const loader = extendLoader(fallback, undefined);

    await loader({ spec: 'foo' } as any);

    expect(fooLoader).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalled();
  });

  it('extendLoader adds new loader for custom spec', async () => {
    const fallback = vitest.fn();
    const fooLoader = vitest.fn();
    const loader = extendLoader(fallback, {
      foo: fooLoader,
    });

    await loader({ spec: 'foo' } as any);

    expect(fooLoader).toHaveBeenCalled();
    expect(fallback).not.toHaveBeenCalled();
  });

  it('extendLoader does not use new for custom spec', async () => {
    const fallback = vitest.fn();
    const fooLoader = vitest.fn();
    const loader = extendLoader(fallback, {
      foo: fooLoader,
    });

    await loader({ spec: 'bar' } as any);

    expect(fooLoader).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalled();
  });

  it('extendLoader only works with string specs', async () => {
    const fallback = vitest.fn();
    const fooLoader = vitest.fn();
    const loader = extendLoader(fallback, {
      foo: fooLoader,
    });

    await loader({ spec: 23 } as any);

    expect(fooLoader).not.toHaveBeenCalled();
    expect(fallback).toHaveBeenCalled();
  });
});
