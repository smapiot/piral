import { computeHash } from './hash';

describe('Hash Module', () => {
  it('computes the right hash for an empty string', () => {
    const result = computeHash('');
    expect(result).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });

  it('computes the right hash for some string', () => {
    const result = computeHash('abcdef');
    expect(result).toBe('1f8ac10f23c5b5bc1167bda84b833e5c057a77d2');
  });

  it('computes the right hash for another string', () => {
    const result = computeHash('abcdef egojeojge');
    expect(result).toBe('a93fe49740ef71148352b5623cc89665c498f571');
  });

  it('computes the right hash for some Buffer', () => {
    const result = computeHash(Buffer.from('7468697320697320612074c3a97374', 'hex'));
    expect(result).toBe('1053a3b21441784a9bb435b27dcd21873a8f1163');
  });

  it('computes the right hash for an empty Buffer', () => {
    const result = computeHash(Buffer.from(''));
    expect(result).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709');
  });
});
