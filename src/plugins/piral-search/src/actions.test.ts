/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createActions as createSearchActions } from './actions';

function createListener() {
  return {
    on: vitest.fn(),
    off: vitest.fn(),
    emit: vitest.fn(),
  };
}

function createActions(state, listener) {
  const obj = {
    ...listener,
    state: state.getState(),
    defineActions(actions) {
      Object.entries(actions).forEach(([name, cb]) => {
        obj[name] = (cb as any).bind(obj, obj);
      });
    },
    readState(select) {
      return select(state.getState());
    },
    dispatch(change) {
      state.setState(change(state.getState()));
    },
  };
  return obj;
}

const state = {
  search: {
    input: 'abc',
    results: {},
  },
  registry: {
    searchProviders: {},
  },
};

describe('Search Action Module', () => {
  it('appendSearchResults cont appends new items with still loading', () => {
    const state: any = create(() => ({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.appendSearchResults(['a', 'b'], false);
    expect(state.getState()).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c', 'a', 'b'],
        },
      },
    });
  });

  it('appendSearchResults stop appends new items without still loading', () => {
    const state: any = create(() => ({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.appendSearchResults(['a'], true);
    expect(state.getState()).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: false,
          items: ['c', 'a'],
        },
      },
    });
  });

  it('prependSearchResults cont prepends new items with still loading', () => {
    const state: any = create(() => ({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.prependSearchResults(['a', 'b'], false);
    expect(state.getState()).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['a', 'b', 'c'],
        },
      },
    });
  });

  it('prependSearchResults stop prepends new items without still loading', () => {
    const state: any = create(() => ({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.prependSearchResults(['a'], true);
    expect(state.getState()).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: false,
          items: ['a', 'c'],
        },
      },
    });
  });

  it('resetSearchResults cont resets the search results while still loading', () => {
    const state: any = create(() => ({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.resetSearchResults('yo', true);
    expect(state.getState()).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: [],
        },
      },
    });
  });

  it('resetSearchResults stop resets the search results without loading', () => {
    const state: any = create(() => ({
      foo: 5,
      search: {
        input: 'yo y',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.resetSearchResults('yo y', false);
    expect(state.getState()).toEqual({
      foo: 5,
      search: {
        input: 'yo y',
        results: {
          loading: false,
          items: [],
        },
      },
    });
  });

  it('setSearchInput sets the input field accordingly', () => {
    const state: any = create(() => ({
      foo: 5,
      search: {
        input: 'yo y',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.setSearchInput('test input');
    expect(state.getState()).toEqual({
      foo: 5,
      search: {
        input: 'test input',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
  });

  it('immediately resets with loading false if some value is given but no provider found', () => {
    state.search.input = 'foo';
    const globalState: any = create(() => state);
    const ctx = createActions(globalState, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(globalState.getState().search.results.loading).toBe(false);
  });

  it('immediately resets with loading true if some value is given and a provider is found', () => {
    state.search.input = 'foo';
    state.registry.searchProviders['example' as any] = {
      search() {
        return Promise.resolve([]);
      },
      clear() {},
      cancel() {},
    };
    const globalState: any = create(() => state);
    const ctx = createActions(globalState, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(globalState.getState().search.results.loading).toBe(true);
  });

  it('immediately resets with loading false if no value is given implicitly', () => {
    state.search.input = '';
    const globalState: any = create(() => state);
    const ctx = createActions(globalState, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(globalState.getState().search.results.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly', () => {
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch('');
    dispose();
    expect(gs.getState().search.results.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly though immediate', () => {
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch('', true);
    dispose();
    expect(gs.getState().search.results.loading).toBe(false);
  });

  it('resets with loading true if no value is given explicitly', () => {
    state.search.input = '';
    state.registry.searchProviders['example' as any] = {
      search() {
        return Promise.resolve([]);
      },
      clear() {},
      cancel() {},
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch('foo');
    expect(gs.getState().search.results.loading).toBe(true);
  });

  it('walks over all search providers', () => {
    const search = vitest.fn(() => Promise.resolve([]));
    const clear = vitest.fn();
    const cancel = vitest.fn();
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: { search, clear, cancel },
      bar: { search, clear, cancel },
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(search).toHaveBeenCalledTimes(2);
  });

  it('wraps results', async () => {
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel() {},
      },
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch((m) => m);
  });

  it('stops existing search', async () => {
    const cancel = vitest.fn();
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel,
      },
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch((m) => m);
    expect(cancel).toHaveBeenCalledTimes(0);
  });

  it('cancels existing search', async () => {
    const cancel = vitest.fn();
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel,
      },
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch();
    dispose();
    await (state.registry.searchProviders as any).foo.search().catch((m) => m);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('catches any emitted exceptions', async () => {
    console.warn = vitest.fn();
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: {
        search() {
          return Promise.reject('ouch!');
        },
        clear() {},
        cancel() {},
      },
    };
    const gs: any = create(() => state);
    const ctx = createActions(gs, createListener());
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch((m) => m);
    expect(console.warn).toHaveBeenCalled();
  });

  it('registerSearchProvider and unregisterSearchProvider', () => {
    const state: any = create(() => ({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {},
      },
    }));
    const ctx = createActions(state, createListener());
    ctx.defineActions(createSearchActions());
    ctx.registerSearchProvider('foo', 10 as any);
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {
          foo: 10,
        },
      },
    });
    ctx.unregisterSearchProvider('foo');
    expect(state.getState()).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {},
      },
    });
  });
});
