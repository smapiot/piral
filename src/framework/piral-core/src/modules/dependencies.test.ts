import { getLocalDependencies } from './dependencies';

describe('Dependencies Module', () => {
  it('getLocalDependencies should contain global dependencies', () => {
    const localDependencies = getLocalDependencies();
    expect(localDependencies).toHaveProperty('react');
    expect(localDependencies).toHaveProperty('history');
  });
});
