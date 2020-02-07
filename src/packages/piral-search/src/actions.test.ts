import { Atom, deref } from '@dbeining/react-atom';
import { createActions as createSearchActions } from './actions';
import { createActions, createListener } from 'piral-core';

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
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.appendSearchResults(['a', 'b'], false);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.appendSearchResults(['a'], true);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.prependSearchResults(['a', 'b'], false);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.prependSearchResults(['a'], true);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.resetSearchResults('yo', true);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.resetSearchResults('yo y', false);
    expect(deref(state)).toEqual({
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
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        results: {
          loading: true,
          items: ['c'],
        },
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.setSearchInput('test input');
    expect(deref(state)).toEqual({
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
    const globalState = Atom.of(state as any);
    const ctx = createActions(globalState, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(deref(globalState).search.results.loading).toBe(false);
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
    const globalState = Atom.of(state as any);
    const ctx = createActions(globalState, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(deref(globalState).search.results.loading).toBe(true);
  });

  it('immediately resets with loading false if no value is given implicitly', () => {
    state.search.input = '';
    const globalState = Atom.of(state as any);
    const ctx = createActions(globalState, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    expect(deref(globalState).search.results.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly', () => {
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch('');
    dispose();
    expect(deref(gs).search.results.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly though immediate', () => {
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch('', true);
    dispose();
    expect(deref(gs).search.results.loading).toBe(false);
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
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch('foo');
    expect(deref(gs).search.results.loading).toBe(true);
  });

  it('walks over all search providers', () => {
    const search = jest.fn(() => Promise.resolve([]));
    const clear = jest.fn();
    const cancel = jest.fn();
    state.search.input = 'test';
    state.registry.searchProviders = {
      foo: { search, clear, cancel },
      bar: { search, clear, cancel },
    };
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
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
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch(m => m);
  });

  it('stops existing search', async () => {
    const cancel = jest.fn();
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
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch(m => m);
    expect(cancel).toHaveBeenCalledTimes(0);
  });

  it('cancels existing search', async () => {
    const cancel = jest.fn();
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
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    const dispose = ctx.triggerSearch();
    dispose();
    await (state.registry.searchProviders as any).foo.search().catch(m => m);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('catches any emitted exceptions', async () => {
    console.warn = jest.fn();
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
    const gs = Atom.of(state as any);
    const ctx = createActions(gs, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.triggerSearch();
    await (state.registry.searchProviders as any).foo.search().catch(m => m);
    expect(console.warn).toHaveBeenCalled();
  });

  it('registerSearchProvider and unregisterSearchProvider', () => {
    const state = Atom.of({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {},
      },
    });
    const ctx = createActions(state, createListener({}));
    ctx.defineActions(createSearchActions());
    ctx.registerSearchProvider('foo', 10 as any);
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {
          foo: 10,
        },
      },
    });
    ctx.unregisterSearchProvider('foo');
    expect(deref(state)).toEqual({
      foo: 5,
      registry: {
        foo: 5,
        searchProviders: {},
      },
    });
  });
});
