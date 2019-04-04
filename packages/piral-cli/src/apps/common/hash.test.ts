import { computeHash, computeMd5 } from './hash';

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

  it('computes the right MD5 for an empty string', () => {
    const result = computeMd5('');
    expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('computes the right MD5 for some string', () => {
    const result = computeMd5('abcdef');
    expect(result).toBe('e80b5017098950fc58aad83c8c14978e');
  });

  it('computes the right MD5 for another string', () => {
    const result = computeMd5('abcdef egojeojge');
    expect(result).toBe('00c67822e6d64f58068ac68c51fc981b');
  });

  it('computes the right MD5 for some Buffer', () => {
    const result = computeMd5(Buffer.from('7468697320697320612074c3a97374', 'hex'));
    expect(result).toBe('5e7470c57cf86538955e7f5c30352f31');
  });

  it('computes the right MD5 for an empty Buffer', () => {
    const result = computeMd5(Buffer.from(''));
    expect(result).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });
});
