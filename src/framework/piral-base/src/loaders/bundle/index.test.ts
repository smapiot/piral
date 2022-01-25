import loader from './index';

jest.mock('./dependency', () => ({
  includeBundle: jest.fn((meta) =>
    meta.name === 'fail'
      ? Promise.reject('errored')
      : Promise.resolve({
          setup: jest.fn(),
        }),
  ),
}));

describe('bundle loader module', () => {
  it('creates a fresh bundle that can load', async () => {
    const meta: any = {
      foo: 'bar',
    };
    const pilet: any = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('bar');
    pilet.setup({} as any);
  });

  it('creates a fresh bundle that fails loading', async () => {
    const meta: any = {
      foo: 'bar',
      name: 'fail',
    };
    const pilet: any = await loader(meta, {});
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe('bar');
    pilet.setup({} as any);
  });
});
