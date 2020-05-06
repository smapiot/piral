import { createInstance } from './createInstance';
import { standardStrategy, blazingStrategy } from 'piral-base';

describe('Piral-Core createInstance module', () => {
  it('createInstance without arguments uses the standard strategy', () => {
    const instance = createInstance();
    expect(instance.options.strategy).toBe(standardStrategy);
  });

  it('createInstance with async argument uses the blazing strategy', () => {
    const instance = createInstance({ async: true });
    expect(instance.options.strategy).toBe(blazingStrategy);
  });
});
