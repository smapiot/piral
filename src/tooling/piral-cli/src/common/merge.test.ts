import { describe, it, expect } from 'vitest';
import { deepMerge } from './merge';

describe('Merge Module', () => {
  it('deepMerge should merge two flat objects together', () => {
    const obj1 = {
      a: 2,
      b: 3,
    };
    const obj2 = {
      a: 5,
      c: 9,
      d: 10,
    };
    const result = deepMerge(obj1, obj2);
    expect(result).toEqual({
      a: 5,
      b: 3,
      c: 9,
      d: 10,
    });
  });

  it('deepMerge should merge two objects together', () => {
    const obj1 = {
      a: 2,
      b: {
        c: {
          c1: 'hi',
          c2: 'ho',
          c3: 5,
        },
      },
    };
    const obj2 = {
      a: 5,
      b: {
        c: {
          c2: 'foo',
          c4: {
            bar: 'yo',
          },
        },
        d: 10,
      },
    };
    const result = deepMerge(obj1, obj2);
    expect(result).toEqual({
      a: 5,
      b: {
        c: {
          c1: 'hi',
          c2: 'foo',
          c3: 5,
          c4: {
            bar: 'yo',
          },
        },
        d: 10,
      },
    });
  });

  it('deepMerge should merge two simple arrays together', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 3, 5, 9];
    const result = deepMerge(arr1, arr2);
    expect(result).toEqual([1, 2, 3, 5, 9]);
  });

  it('deepMerge should not merge object and array together', () => {
    const arr1 = [1, 2, 3];
    const arr2 = {
      0: 1,
      1: 5,
      2: 9,
    };
    const result = deepMerge(arr1, arr2);
    expect(result).toEqual(arr2);
  });

  it('deepMerge should not merge array and object together', () => {
    const arr1 = {
      0: 1,
      1: 5,
      2: 9,
    };
    const arr2 = [1, 2, 3];
    const result = deepMerge(arr1, arr2);
    expect(result).toEqual(arr2);
  });

  it('deepMerge should merge two complex objects together', () => {
    const obj1 = {
      b: {
        c: [
          true,
          {
            d: {
              e: 2,
            },
          },
        ],
      },
    };
    const obj2 = {
      a: 5,
      b: {
        c: [
          false,
          {
            d: {
              f: 9,
            },
          },
        ],
        d: 10,
      },
    };
    const result = deepMerge(obj1, obj2);
    expect(result).toEqual({
      a: 5,
      b: {
        c: [
          true,
          {
            d: {
              e: 2,
              f: 9,
            },
          },
          false,
        ],
        d: 10,
      },
    });
  });
});
