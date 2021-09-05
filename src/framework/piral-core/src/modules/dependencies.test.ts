import { globalDependencies, defaultDependencySelector, defaultModuleRequester } from './dependencies';

describe('Dependencies Module', () => {
  it('globalDependencies should contain global dependencies', () => {
    expect(globalDependencies).toHaveProperty('react');
    expect(globalDependencies).toHaveProperty('history');
    expect(globalDependencies).not.toHaveProperty('foo');
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
