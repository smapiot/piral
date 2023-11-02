/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';
import { createFeedOptions } from './utils';

describe('Feed Module', () => {
  it('createFeedOptions works with a function resolver', () => {
    const resolver = vitest.fn();
    const result = createFeedOptions('foo', resolver);
    result.initialize();
    result.update(undefined, undefined);
    expect(result.immediately).toBeFalsy();
    expect(result.id).toBe('foo');
    expect(result.initialize).not.toBeUndefined();
    expect(result.update).not.toBeUndefined();
    expect(result.reducers).not.toBeUndefined();
    expect(result.connect).not.toBeUndefined();
    const cleanup = result.connect(undefined);
    expect(cleanup).not.toBeUndefined();
    cleanup();
    expect(resolver).toHaveBeenCalled();
  });

  it('createFeedOptions works with a resolver object', () => {
    const options = {
      connect: vitest.fn(),
      update: vitest.fn(),
      initialize: vitest.fn(),
    };
    const result = createFeedOptions('foo', options);
    expect(result.immediately).toBeFalsy();
    expect(result.id).toBe('foo');
    expect(result.initialize).not.toBeUndefined();
    expect(result.update).not.toBeUndefined();
    expect(result.reducers).not.toBeUndefined();
    expect(result.connect).not.toBeUndefined();
    result.connect(undefined);
    result.initialize();
    result.update('hello', undefined);
    expect(options.update).toHaveBeenCalled();
    expect(options.connect).toHaveBeenCalled();
    expect(options.initialize).toHaveBeenCalled();
  });

  it('createFeedOptions works with reducers', () => {
    const reducers = {
      a() {},
      b() {},
      c() {},
    };
    const options = {
      connect: vitest.fn(),
      update: vitest.fn(),
      initialize: vitest.fn(),
      reducers,
    };
    const result = createFeedOptions('foo', options);
    expect(result.reducers).toBe(reducers);
  });

  it('createFeedOptions works immediately', () => {
    const options = {
      connect: vitest.fn(),
      update: vitest.fn(),
      initialize: vitest.fn(),
      immediately: true,
    };
    const result = createFeedOptions('bar', options);
    expect(result.immediately).toBeTruthy();
    expect(result.id).toBe('bar');
  });
});
