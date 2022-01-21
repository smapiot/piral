import { normalizePublicUrl } from './url';

describe('Url Module', () => {
  it('normalizePublicUrl always returns at least /', () => {
    const result = normalizePublicUrl('');
    expect(result).toBe('/');
  });

  it('normalizePublicUrl makes URLs end with /', async () => {
    const result = normalizePublicUrl('/foo');
    expect(result).toBe('/foo/');
  });

  it('normalizePublicUrl makes URLs start with /', async () => {
    const result = normalizePublicUrl('foo/');
    expect(result).toBe('/foo/');
  });

  it('normalizePublicUrl makes URLs start and end with /', async () => {
    const result = normalizePublicUrl('foo');
    expect(result).toBe('/foo/');
  });

  it('normalizePublicUrl leaves good URLs as-is', async () => {
    const result = normalizePublicUrl('/foo/bar/1.2.3/');
    expect(result).toBe('/foo/bar/1.2.3/');
  });
});
