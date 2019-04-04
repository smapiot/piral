import { compare } from './compare';

describe('Compare Module', () => {
  it('compare works with numbers that are not equal', () => {
    const result = compare(5, 2);
    expect(result).toEqual(false);
  });

  it('compare works with numbers that are equal', () => {
    const result = compare(7, 7);
    expect(result).toEqual(true);
  });

  it('compare works with booleans that are not equal', () => {
    const result = compare(true, false);
    expect(result).toEqual(false);
  });

  it('compare works with booleans that are equal', () => {
    const result = compare(false, false);
    expect(result).toEqual(true);
  });

  it('compare works with strings that are not equal', () => {
    const result = compare('foo', 'bar');
    expect(result).toEqual(false);
  });

  it('compare works with strings that are equal', () => {
    const result = compare('gtest', 'gtest');
    expect(result).toEqual(true);
  });

  it('compare works with types that are not equal', () => {
    const result = compare('5', 5 as any);
    expect(result).toEqual(false);
  });

  it('compare works with arrays of simple types that are not equal', () => {
    const result = compare([1, 2, 3], [1, 2, 4]);
    expect(result).toEqual(false);
  });

  it('compare works with arrays of simple types that have different lengths', () => {
    const result = compare([1, 2, 3], [1, 2]);
    expect(result).toEqual(false);
  });

  it('compare works with arrays of simple types that are equal', () => {
    const result = compare([1, 2, 3], [1, 2, 3]);
    expect(result).toEqual(true);
  });

  it('compare works with objects of simple types that are not equal', () => {
    const result = compare({ a: 2, b: true, c: 'hi' }, { a: 2, b: false, c: 'hi' });
    expect(result).toEqual(false);
  });

  it('compare works with objects of simple types that have different keys', () => {
    const result = compare({ a: 2, b: true, c: 'hi' }, { a: 2, b: true, d: 'hi' });
    expect(result).toEqual(false);
  });

  it('compare works with objects of simple types that have less keys', () => {
    const result = compare({ a: 2, b: true, c: 'hi' }, { a: 2, b: true });
    expect(result).toEqual(false);
  });

  it('compare works with objects of simple types that are equal', () => {
    const result = compare({ a: 2, b: true, c: 'hi' }, { a: 2, b: true, c: 'hi' });
    expect(result).toEqual(true);
  });
});
