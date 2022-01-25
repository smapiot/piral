import { includeBundle } from './dependency';

jest.mock('../../utils', () => ({
  includeScript: jest.fn(() => ({
    setup: jest.fn(),
  })),
}));

describe('bundle dependency module', () => {
  it('creates a pure bundle using the setup function with a name', async () => {
    const meta: any = {
      name: 'my-pilet',
      foo: 'bar',
    };
    const pilet: any = await includeBundle(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });

  it('creates a pure bundle using the setup function without a name', async () => {
    const meta: any = {
      foo: 'bar',
    };
    const pilet: any = await includeBundle(meta);
    expect(typeof pilet.setup).toBe('function');
    expect(pilet.foo).toBe(undefined);
    pilet.setup({} as any);
  });
});
