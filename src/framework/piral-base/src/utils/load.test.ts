import { loadFrom } from './load';

jest.mock('./dependency', () => ({
  includeScriptDependency: jest.fn(() => Promise.resolve()),
  createEvaluatedPilet: jest.requireActual('./dependency').createEvaluatedPilet,
  emptyApp: {
    setup: jest.fn(),
  },
}));

describe('Load utility module', () => {
  it('loadFrom without dependencies directly uses loader function', async () => {
    const loader: any = jest.fn(() => ({ a: 'foo' }));
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
    const loader: any = jest.fn(() => Promise.reject('errored'));
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
    const setup = jest.fn();
    const loader: any = jest.fn(() => Promise.resolve({ setup }));
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
    const loader: any = jest.fn(() =>({ a: 'foo' }));
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
    const loader: any = jest.fn(() =>({ a: 'foo' }));
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
