/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createSearchApi } from './create';

function createMockContainer() {
  const state = create(() => ({
    app: {
      wrap: false,
    },
    registry: {
      wrappers: {},
      extensions: {},
    },
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      readState(cb) {
        return cb(state.getState());
      },
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {
      meta: {
        name: '',
      },
    } as any,
  };
}

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

describe('Create Search API Extensions', () => {
  it('createCoreApi can register and unregister a search provider', () => {
    const container = createMockContainer();
    container.context.registerSearchProvider = vitest.fn();
    container.context.unregisterSearchProvider = vitest.fn();
    const api = (createSearchApi()(container.context) as any)(container.api, moduleMetadata);
    api.registerSearchProvider('my-sp', () => Promise.resolve([]));
    expect(container.context.registerSearchProvider).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterSearchProvider).toHaveBeenCalledTimes(0);
    api.unregisterSearchProvider('my-sp');
    expect(container.context.registerSearchProvider).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterSearchProvider.mock.calls[0][0]).toBe(
      container.context.registerSearchProvider.mock.calls[0][0],
    );
  });

  it('createCoreApi registration of a search provider wraps it', () => {
    const container = createMockContainer();
    container.context.registerSearchProvider = vitest.fn();
    container.context.unregisterSearchProvider = vitest.fn();
    const api = (createSearchApi()(container.context) as any)(container.api, moduleMetadata);
    const search = vitest.fn();
    api.registerSearchProvider('my-sp', search);
    container.context.registerSearchProvider.mock.calls[0][1].search('foo');
    expect(search).toHaveBeenCalledWith('foo', container.api);
  });
});
