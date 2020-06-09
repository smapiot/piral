import { extendConfig } from './settings';

describe('Piral CLI Settings', () => {
  it('with one additional option', () => {
    const result = extendConfig({
      foo: true,
    } as any);
    expect(result).toHaveProperty('foo');
  });

  it('always has sourcemaps active', () => {
    const result = extendConfig({});
    expect(result).toHaveProperty('sourceMaps', true);
  });
});
