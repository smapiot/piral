import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import { loadFrom } from './load';

vitest.mock('./dependency', async () => ({
  includeScriptDependency: vitest.fn(() => Promise.resolve()),
  createEvaluatedPilet: ((await vitest.importActual('./dependency')) as any).createEvaluatedPilet,
  emptyApp: {
    setup: vitest.fn(),
  },
}));

describe('Load utility module', () => {
  it('loadFrom without dependencies directly uses loader function', async () => {
    const loader: any = vitest.fn(() => ({ a: 'foo' }));
    const meta: any = { b: 'bar', link: 'http://foo.com/foo/bar/example.js' };
    const pilet = await loadFrom(meta, loader);
    expect(pilet).toEqual({
      basePath: 'http://foo.com/foo/bar/',
      b: meta.b,
      link: meta.link,
      setup: expect.anything(),
    });
    expect(typeof pilet.setup).toBe('function');
  });

  it('loadFrom with failing loader function', async () => {
    const loader: any = vitest.fn(() => Promise.reject('errored'));
    const meta: any = { b: 'bar', link: 'http://foo.com/example.js' };
    const pilet: any = await loadFrom(meta, loader);
    expect(pilet).toEqual({
      basePath: 'http://foo.com/',
      b: meta.b,
      link: meta.link,
      setup: expect.anything(),
    });
    pilet.setup();
  });

  it('loadFrom without dependencies works with promises', async () => {
    const setup = vitest.fn();
    const loader: any = vitest.fn(() => Promise.resolve({ setup }));
    const meta: any = { a: 'bar', link: '' };
    const pilet: any = await loadFrom(meta, loader);
    expect(pilet).toEqual({
      basePath: '',
      a: meta.a,
      link: meta.link,
      setup,
    });
    pilet.setup();
  });

  it('loadFrom with empty dependencies works', async () => {
    const loader: any = vitest.fn(() => ({ a: 'foo' }));
    const meta: any = { b: 'bar', link: '', dependencies: {} };
    const pilet = await loadFrom(meta, loader);
    expect(pilet).toEqual({
      basePath: '',
      dependencies: {},
      b: meta.b,
      link: meta.link,
      setup: expect.anything(),
    });
  });

  it('loadFrom with non-empty dependencies works', async () => {
    const loader: any = vitest.fn(() => ({ a: 'foo' }));
    const dependencies = {
      a: 'foo.js',
      b: 'bar.js',
      setup: expect.anything(),
    };
    const meta: any = { b: 'bar', dependencies, link: '' };
    const pilet = await loadFrom(meta, loader);
    expect(pilet).toEqual({
      basePath: '',
      dependencies,
      b: meta.b,
      link: meta.link,
      setup: expect.anything(),
    });
  });
});
