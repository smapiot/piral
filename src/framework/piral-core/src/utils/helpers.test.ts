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
} from './helpers';

describe('Helpers Module', () => {
  it('prependItem works with an existing array', () => {
    const result = prependItem([1, 2, 3], 4);
    expect(result).toEqual([4, 1, 2, 3]);
  });

  it('prependItem works without an existing array', () => {
    const result = prependItem(undefined, 4);
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
    const result = appendItem(undefined, 4);
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
    const result = prependItems(undefined, [4]);
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
    const result = appendItems(undefined, [4]);
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
    const result = excludeItem(undefined, 2);
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
    const result = excludeOn(undefined, (x) => x === 2);
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
    const result = withKey(original, 'b', 6);
    expect(result).toEqual({
      a: 5,
      b: 6,
    });
  });

  it('withKey does not modify existing object', () => {
    const original = { a: 5 };
    const result = withKey(original, 'b', 6);
    expect(result).not.toBe(original);
  });

  it('withKey works without an existing object', () => {
    const result = withKey(undefined, 'b', 6);
    expect(result).toEqual({
      b: 6,
    });
  });

  it('withoutKey ignores non-existing key', () => {
    const original = { a: 5 };
    const result = withoutKey(original, 'b');
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
    const result = withoutKey(undefined, 'a');
    expect(result).toEqual({});
  });

  it('withoutKey works without a valid key', () => {
    const result = withoutKey({}, undefined as any);
    expect(result).toEqual({});
  });

  it('withoutKey works with a number', () => {
    const result = withoutKey({ 0: 'hello' }, 0 as any);
    expect(result).toEqual({});
  });

  it('updateKey with the removeIndicator', () => {
    const result = updateKey({ b: '1233' }, 'b', null);
    expect(result).toEqual({});
  });

  it('updateKey with a new value', () => {
    const result = updateKey({ b: '1233' }, 'b', '1244');
    expect(result).toEqual({ b: '1244' });
  });
});
