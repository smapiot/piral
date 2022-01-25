import loader from './index';

describe('v2 loader module', () => {
  it('creates a new pilet with an empty setup function', async () => {
    const app = {
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {};
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet that fails loading', async () => {
    const app = {
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.reject('errored')) as any;
    const meta: any = {};
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet with empty dependencies', async () => {
    const app = {
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.resolve(app)) as any;
    const meta: any = {
      dependencies: {},
    };
    const pilet = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    pilet.setup({} as any);
  });

  it('creates a new pilet with some new dependencies', async () => {
    const app = {
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.resolve(app)) as any;
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
      setup: jest.fn(),
    };
    System.has = jest.fn(() => true);
    System.import = jest.fn(() => Promise.resolve(app)) as any;
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
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.resolve(app)) as any;
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
      setup: jest.fn(),
    };
    System.import = jest.fn(() => Promise.resolve(app)) as any;
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
});
