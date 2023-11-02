import { describe, it, expect } from 'vitest';
import { onlyUnique, onlyUniqueFiles } from './utils';

describe('only unique', () => {
  it('should filter out duplicates', () => {
    const arr = [1, 2, 3, 4, 3];
    const res = arr.filter(onlyUnique);
    expect(res).toEqual([1, 2, 3, 4]);
  });

  it('should filter out duplicated files', () => {
    const res = ['foo/bar', 'bar/foo', 'foo/bar'].filter(onlyUniqueFiles);
    expect(res).toEqual(['foo/bar', 'bar/foo']);
  });

  it('should filter out child directories from front', () => {
    const res = ['foo/bar/3', 'bar/foo', 'foo/bar'].filter(onlyUniqueFiles);
    expect(res).toEqual(['bar/foo', 'foo/bar']);
  });

  it('should filter out child directories from back', () => {
    const res = ['foo', 'bar/foo', 'foo/bar'].filter(onlyUniqueFiles);
    expect(res).toEqual(['foo', 'bar/foo']);
  });
});
