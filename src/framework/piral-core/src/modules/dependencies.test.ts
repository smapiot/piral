import { describe, it, expect } from 'vitest';
import { globalDependencies, defaultDependencySelector, defaultModuleRequester } from './dependencies';

describe('Dependencies Module', () => {
  it('globalDependencies should not contain any dependencies', () => {
    expect(globalDependencies).toEqual({});
  });

  it('defaultDependencySelector should return given dependencies', () => {
    const deps = defaultDependencySelector({
      foo: 'bar',
    });
    expect(deps).toHaveProperty('foo');
    expect(deps).not.toHaveProperty('bar');
  });

  it('defaultModuleRequester should return given dependencies', async () => {
    const mods = await defaultModuleRequester();
    expect(mods).toEqual([]);
  });
});
