import { findCompatVersion } from './info';

describe('CLI info module', () => {
  it('findCompatVersion identifies the pre v1 version correcty', () => {
    const result = findCompatVersion('0.10.2');
    expect(result).toBe('0.10');
  });

  it('findCompatVersion identifies the post v1 version correcty', () => {
    const result = findCompatVersion('2.10.2');
    expect(result).toBe('2');
  });
});
