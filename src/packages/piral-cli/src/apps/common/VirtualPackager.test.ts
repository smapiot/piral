import { VirtualPackager } from './VirtualPackager';

describe('VirtualPackager extension module', () => {
  it('Returns just 0 for everything', () => {
    const packager = new VirtualPackager({}, {});
    const size = packager.getSize();
    expect(size).toBe(0);
  });
});
