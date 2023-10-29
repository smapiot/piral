import { describe, it, expect, vitest } from 'vitest';
import { callfunc, getBasePath, isfunc, promisify } from './helpers';

describe('Helpers utils module', () => {
  it('callfunc works with no func given', () => {
    callfunc(undefined, 'a', 'b');
  });

  it('callfunc works with a func given', () => {
    const fn = vitest.fn();
    callfunc(fn, 'a', 'b');
    expect(fn).toBeCalledWith('a', 'b');
  });

  it('getBasePath works with an ordinary URL', () => {
    const link = getBasePath('https://foo.com/my-link/index.js');
    expect(link).toBe('https://foo.com/my-link/');
  });

  it('getBasePath works with nothing', () => {
    const link = getBasePath('');
    expect(link).toBe('');
  });

  it('getBasePath works with undefined', () => {
    const link = getBasePath(undefined);
    expect(link).toBe(undefined);
  });

  it('isfunc properly evaluates if the argument is a function', () => {
    expect(isfunc(undefined)).toBe(false);
    expect(isfunc(true)).toBe(false);
    expect(isfunc(vitest.fn())).toBe(true);
  });

  it('promisify turns something into a promise', () => {
    const value1 = undefined;
    const value2 = Promise.resolve('foo');
    expect(promisify(value1)).not.toBe(value1);
    expect(promisify(value1)).toBeInstanceOf(Promise);
    expect(promisify(value2)).toBe(value2);
  });
});
