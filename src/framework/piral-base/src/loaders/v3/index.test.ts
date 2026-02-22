import 'systemjs/dist/system.js';
import 'systemjs/dist/extras/named-register.js';

import { describe, it, expect, vitest } from 'vitest';
import loader from './index';
import type { Pilet } from '../../types';

describe('v3 loader module', () => {
  it('creates a new pilet with an empty setup function', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {};
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet that fails loading', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.reject('errored')) as any;
    const meta: any = {};
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet with empty dependencies', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      dependencies: {},
    };
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet with some new dependencies', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      dependencies: {
        a: 'foo',
        b: 'bar',
      },
    };
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet with some existing dependencies', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.has = vitest.fn(() => true);
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      dependencies: {
        a: 'foo',
      },
    };
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('attaches new metadata that is decoupled', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      foo: 'a',
    };
    const pilet: any = await loader(meta, {});
    meta.bar = 'b';
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('a');
    expect(pilet.bar).toBe(undefined);
    pilet.setup({} as any);
  });

  it('attaches new basePath based on link property', async () => {
    const app = {
      setup: vitest.fn(),
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      foo: 'a',
      link: 'https://example.com/foo/bar/index.js',
    };
    const pilet: any = await loader(meta, {});
    meta.bar = 'b';
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('a');
    expect(pilet.bar).toBe(undefined);
    expect(pilet.basePath).toBe('https://example.com/foo/bar/');
  });

  it('handles style links gracefully', async () => {
    const app = {
      setup: vitest.fn(),
      styles: [
        'style1.css',
        '/style2.css',
        '../style3.css',
        'assets/style4.css',
        'https://somewhereelse.com/style.css',
        '/a/b/c/style6.css',
        '//style7.css',
      ],
    };
    System.import = vitest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      foo: 'a',
      link: 'https://example.com/foo/bar/index.js',
    };
    const outputStyles: Array<string> = [];
    const attachStyles = (_pilet: Pilet, url: string) => outputStyles.push(url);
    await loader(meta, { attachStyles });
    expect(outputStyles).toEqual([
      'https://example.com/foo/bar/style1.css',
      'https://example.com/foo/bar/style2.css',
      'https://example.com/foo/style3.css',
      'https://example.com/foo/bar/assets/style4.css',
      'https://somewhereelse.com/style.css',
      'https://example.com/foo/bar/a/b/c/style6.css',
      'https://style7.css/',
    ]);
  });
});
