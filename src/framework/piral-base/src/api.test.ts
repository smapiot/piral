/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';
import { initializeApi, mergeApis } from './api';
import { createListener } from './events';

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('API Module', () => {
  it('createCoreApi pluginMeta returns the metadata', () => {
    const container = {
      on: vitest.fn(),
      off: vitest.fn(),
      once: vitest.fn(),
      emit: vitest.fn(),
    };
    const api = initializeApi(moduleMetadata, container);
    expect(api.meta).toEqual({
      name: moduleMetadata.name,
      version: moduleMetadata.version,
      hash: moduleMetadata.hash,
    });
  });

  it('mergeApis merges multiple APIs', () => {
    const baseApi: any = {
      a: 'foo',
    };
    const newApi = mergeApis(baseApi, [() => ({ b: 'bar' } as any)], {} as any);
    expect(newApi).toEqual({
      a: 'foo',
      b: 'bar',
    });
    expect(newApi).toBe(baseApi);
  });

  it('calling event APIs without this context does not throw', () => {
    // This test case covers GH issue #664: https://github.com/smapiot/piral/issues/664
    const events = createListener(undefined);
    const api = initializeApi(moduleMetadata, events);

    // These calls should not throw:
    const { on, off, once, emit } = api;
    on('foo', () => {});
    off('foo', () => {});
    once('foo', () => {});
    emit('foo', {});

    // Chaining should also work as each event fn returns this (i.e., the event emitter):
    expect(
      on('foo', () => {})
        .off('foo', () => {})
        .once('foo', () => {})
        .emit('foo', {}),
    ).not.toBeUndefined();
  });
});
