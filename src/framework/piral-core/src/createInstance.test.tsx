import { describe, it, expect, vitest } from 'vitest';
import { createInstance } from './createInstance';
import { standardStrategy, blazingStrategy } from 'piral-base';

vitest.mock('../app.codegen', () => ({
  createNavigation: vitest.fn(() => ({
    publicPath: '/',
  })),
  fillDependencies: vitest.fn(),
  integrateDebugger: vitest.fn(),
  integrateEmulator: vitest.fn(),
  publicPath: '/',
  createDefaultState() {
    return {};
  },
}));

describe('Piral-Core createInstance module', () => {
  it('createInstance without arguments uses the standard strategy', () => {
    const instance = createInstance();
    expect(instance.options.strategy).toBe(standardStrategy);
  });

  it('createInstance with async argument uses the blazing strategy', () => {
    const instance = createInstance({ async: true });
    expect(instance.options.strategy).toBe(blazingStrategy);
  });

  it('createInstance with empty actions and plugins uses the standard strategy', () => {
    const instance = createInstance({ plugins: {}, actions: {} });
    expect(instance.options.strategy).toBe(standardStrategy);
  });

  it('createInstance with async function uses the blazing strategy', () => {
    const instance = createInstance({ async: () => {} });
    expect(instance.options.strategy).not.toBe(blazingStrategy);
  });
});
