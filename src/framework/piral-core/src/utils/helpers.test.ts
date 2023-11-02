import { describe, it, expect } from 'vitest';
import {
  appendItem,
  excludeItem,
  excludeOn,
  prependItem,
  withKey,
  withoutKey,
  prependItems,
  appendItems,
  updateKey,
  replaceOrAddItem,
  includeItem,
  tryParseJson,
  removeNested,
} from './helpers';

describe('Helpers Module', () => {
  it('removeNested removes keys values', () => {
    const obj = { d: 'test', z: ['test arr'] };
    const result = removeNested(obj, () => true);
    const expectedResult = { d: {}, z: {} };
    expect(result).toEqual(expectedResult);
  });

  it('removeNested removes keys values with nested arrays', () => {
    const obj = { z: [['test arr'], ['test arr2']] };
    const result = removeNested(obj, () => true);
    const expectedResult = { z: { '0': [], '1': [] } };
    expect(result).toEqual(expectedResult);
  });

  it('removeNested splits keys values', () => {
    const obj = { d: 'test', z: ['test arr'] };
    const result = removeNested(obj, () => false);
    const expectedResult = { d: { '0': 't', '1': 'e', '2': 's', '3': 't' }, z: { '0': 'test arr' } };
    expect(result).toEqual(expectedResult);
  });

  it('tryParseJson parses a JSON string', () => {
    const content = '{"result":true, "count":42}';
    const result = tryParseJson(content);
    expect(result).toEqual({ result: true, count: 42 });
  });

  it('tryParseJson return empty object if the content is not valid', () => {
    const content = '"result":true, "count":42';
    const result = tryParseJson(content);
    expect(result).toEqual({});
  });

  it('includeItem adds an item to array', () => {
    const result = includeItem([1, 2, 3], 4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('replaceOrAddItem replaces the first item', () => {
    const result = replaceOrAddItem([1, 2, 3], 4, () => true);
    expect(result).toEqual([4, 2, 3]);
  });

  it('replaceOrAddItem adds the item the end', () => {
    const result = replaceOrAddItem([1, 2, 3], 4, () => false);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('prependItem works with an existing array', () => {
    const result = prependItem([1, 2, 3], 4);
    expect(result).toEqual([4, 1, 2, 3]);
  });

  it('prependItem works without an existing array', () => {
    const result = prependItem(undefined as any, 4);
    expect(result).toEqual([4]);
  });

  it('prependItem does not modify the original', () => {
    const original = [1, 2, 3];
    const result = prependItem(original, 4);
    expect(result).not.toBe(original);
  });

  it('appendItem works with an existing array', () => {
    const result = appendItem([1, 2, 3], 4);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('appendItem works without an existing array', () => {
    const result = appendItem(undefined as any, 4);
    expect(result).toEqual([4]);
  });

  it('appendItem does not modify the original', () => {
    const original = [1, 2, 3];
    const result = appendItem(original, 4);
    expect(result).not.toBe(original);
  });

  it('prependItems works with an existing array', () => {
    const result = prependItems([1, 2, 3], [4]);
    expect(result).toEqual([4, 1, 2, 3]);
  });

  it('prependItems prepends multiple', () => {
    const result = prependItems([1, 2, 3], [4, 5, 6]);
    expect(result).toEqual([4, 5, 6, 1, 2, 3]);
  });

  it('prependItems prepends none', () => {
    const result = prependItems([1, 2, 3], []);
    expect(result).toEqual([1, 2, 3]);
  });

  it('prependItems works without an existing array', () => {
    const result = prependItems(undefined as any, [4]);
    expect(result).toEqual([4]);
  });

  it('prependItems does not modify the original', () => {
    const original = [1, 2, 3];
    const result = prependItems(original, [4]);
    expect(result).not.toBe(original);
  });

  it('appendItems works with an existing array', () => {
    const result = appendItems([1, 2, 3], [4]);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('appendItems works without an existing array', () => {
    const result = appendItems(undefined as any, [4]);
    expect(result).toEqual([4]);
  });

  it('appendItems does not modify the original', () => {
    const original = [1, 2, 3];
    const result = appendItems(original, [4]);
    expect(result).not.toBe(original);
  });

  it('appendItems does not modify the original also with none', () => {
    const original = [1, 2, 3];
    const result = appendItems(original, []);
    expect(result).not.toBe(original);
  });

  it('appendItems appends multiple', () => {
    const original = [1, 2, 3];
    const result = appendItems(original, [4, 5]);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('excludeItem works with an existing array', () => {
    const result = excludeItem([1, 2, 3], 2);
    expect(result).toEqual([1, 3]);
  });

  it('excludeItem works without an existing array', () => {
    const result = excludeItem(undefined as any, 2);
    expect(result).toEqual([]);
  });

  it('excludeItem ignores non-existing item', () => {
    const result = excludeItem([1, 2, 3], 4);
    expect(result).toEqual([1, 2, 3]);
  });

  it('excludeItem does not modify the original', () => {
    const original = [1, 2, 3];
    const result = excludeItem(original, 2);
    expect(result).not.toBe(original);
  });

  it('excludeOn works with an existing array', () => {
    const result = excludeOn([1, 2, 3], (x) => x === 2);
    expect(result).toEqual([1, 3]);
  });

  it('excludeOn works without an existing array', () => {
    const result = excludeOn(undefined as any, (x) => x === 2);
    expect(result).toEqual([]);
  });

  it('excludeOn ignores non-existing item', () => {
    const result = excludeOn([1, 2, 3], (x) => x === 4);
    expect(result).toEqual([1, 2, 3]);
  });

  it('excludeOn does not modify the original', () => {
    const original = [1, 2, 3];
    const result = excludeOn(original, (x) => x === 2);
    expect(result).not.toBe(original);
  });

  it('withKey works with an existing object', () => {
    const original = { a: 5 };
    const result = withKey(original, 'b' as any, 6);
    expect(result).toEqual({
      a: 5,
      b: 6,
    });
  });

  it('withKey does not modify existing object', () => {
    const original = { a: 5 };
    const result = withKey(original, 'b' as any, 6);
    expect(result).not.toBe(original);
  });

  it('withKey works without an existing object', () => {
    const result = withKey(undefined, 'b' as never, 6 as never);
    expect(result).toEqual({
      b: 6,
    });
  });

  it('withoutKey ignores non-existing key', () => {
    const original = { a: 5 };
    const result = withoutKey(original, 'b' as any);
    expect(result).toEqual({
      a: 5,
    });
  });

  it('withoutKey removes existing key leaving multiple keys behind', () => {
    const original = { a: 5, b: 6, c: 7 };
    const result = withoutKey(original, 'b');
    expect(result).toEqual({
      a: 5,
      c: 7,
    });
  });

  it('withoutKey removes existing key to empty object', () => {
    const original = { a: 5 };
    const result = withoutKey(original, 'a');
    expect(result).toEqual({});
  });

  it('withoutKey removes existing key and leaves old ones', () => {
    const original = { a: 5, b: 6, c: 7 };
    const result = withoutKey(original, 'a');
    expect(result).toEqual({
      b: 6,
      c: 7,
    });
  });

  it('withoutKey works without an existing object', () => {
    const result = withoutKey(undefined, 'a' as never);
    expect(result).toEqual({});
  });

  it('withoutKey works without a valid key', () => {
    const result = withoutKey({}, undefined as never);
    expect(result).toEqual({});
  });

  it('withoutKey works with a number', () => {
    const result = withoutKey({ 0: 'hello' }, 0 as any);
    expect(result).toEqual({});
  });

  it('updateKey with the removeIndicator', () => {
    const result = updateKey({ b: '1233' }, 'b', null as any);
    expect(result).toEqual({});
  });

  it('updateKey with a new value', () => {
    const result = updateKey({ b: '1233' }, 'b', '1244');
    expect(result).toEqual({ b: '1244' });
  });
});
