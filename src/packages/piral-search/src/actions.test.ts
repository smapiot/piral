import { Atom, deref } from '@dbeining/react-atom';
import {
  appendSearchResults,
  prependSearchResults,
  resetSearchResults,
  setSearchInput,
  triggerSearch,
  registerSearchProvider,
  unregisterSearchProvider,
} from './actions';

const state = {
  search: {
    input: 'abc',
  },
  components: {
    searchProviders: {},
  },
};

describe('Search Action Module', () => {
  it('appendSearchResults cont appends new items with still loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    appendSearchResults(state, ['a', 'b'], false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c', 'a', 'b'],
      },
    });
  });

  it('appendSearchResults stop appends new items without still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    appendSearchResults(state, ['a'], true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: false,
        results: ['c', 'a'],
      },
    });
  });

  it('prependSearchResults cont prepends new items with still loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    prependSearchResults(state, ['a', 'b'], false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo',
        loading: true,
        results: ['a', 'b', 'c'],
      },
    });
  });

  it('prependSearchResults stop prepends new items without still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    prependSearchResults(state, ['a'], true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: false,
        results: ['a', 'c'],
      },
    });
  });

  it('resetSearchResults cont resets the search results while still loading', () => {
    const state = Atom.of({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: ['c'],
      },
    });
    resetSearchResults(state, 'yo', true);
    expect(deref(state)).toEqual({
      foo: [1, 2],
      search: {
        input: 'yo',
        loading: true,
        results: [],
      },
    });
  });

  it('resetSearchResults stop resets the search results without loading', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        loading: true,
        results: ['c'],
      },
    });
    resetSearchResults(state, 'yo y', false);
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'yo y',
        loading: false,
        results: [],
      },
    });
  });

  it('setSearchInput sets the input field accordingly', () => {
    const state = Atom.of({
      foo: 5,
      search: {
        input: 'yo y',
        loading: true,
        results: ['c'],
      },
    });
    setSearchInput(state, 'test input');
    expect(deref(state)).toEqual({
      foo: 5,
      search: {
        input: 'test input',
        loading: true,
        results: ['c'],
      },
    });
  });

  it('immediately resets with loading false if some value is given but no provider found', () => {
    state.search.input = 'foo';
    const ctx = Atom.of(state as any);
    triggerSearch(ctx);
    expect(deref(ctx).search.loading).toBe(false);
  });

  it('immediately resets with loading true if some value is given and a provider is found', () => {
    state.search.input = 'foo';
    state.components.searchProviders['example' as any] = {
      search() {
        return Promise.resolve([]);
      },
      clear() {},
      cancel() {},
    };
    const ctx = Atom.of(state as any);
    triggerSearch(ctx);
    expect(deref(ctx).search.loading).toBe(true);
  });

  it('immediately resets with loading false if no value is given implicitly', () => {
    state.search.input = '';
    const ctx = Atom.of(state as any);
    triggerSearch(ctx);
    expect(deref(ctx).search.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly', () => {
    const ctx = Atom.of(state as any);
    const dispose = triggerSearch(ctx, '');
    dispose();
    expect(deref(ctx).search.loading).toBe(false);
  });

  it('immediately resets with loading false if no value is given explicitly though immediate', () => {
    const ctx = Atom.of(state as any);
    const dispose = triggerSearch(ctx, '', true);
    dispose();
    expect(deref(ctx).search.loading).toBe(false);
  });

  it('resets with loading true if no value is given explicitly', () => {
    state.search.input = '';
    state.components.searchProviders['example' as any] = {
      search() {
        return Promise.resolve([]);
      },
      clear() {},
      cancel() {},
    };
    const ctx = Atom.of(state as any);
    triggerSearch(ctx, 'foo');
    expect(deref(ctx).search.loading).toBe(true);
  });

  it('walks over all search providers', () => {
    const search = jest.fn(() => Promise.resolve([]));
    const clear = jest.fn();
    const cancel = jest.fn();
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: { search, clear, cancel },
      bar: { search, clear, cancel },
    };
    triggerSearch(Atom.of(state));
    expect(search).toHaveBeenCalledTimes(2);
  });

  it('wraps results', async () => {
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel() {},
      },
    };
    triggerSearch(Atom.of(state));
    await (state.components.searchProviders as any).foo.search().catch(m => m);
  });

  it('stops existing search', async () => {
    const cancel = jest.fn();
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel,
      },
    };
    triggerSearch(Atom.of(state));
    await (state.components.searchProviders as any).foo.search().catch(m => m);
    expect(cancel).toHaveBeenCalledTimes(0);
  });

  it('cancels existing search', async () => {
    const cancel = jest.fn();
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.resolve(['Hello', 'World']);
        },
        clear() {},
        cancel,
      },
    };
    const dispose = triggerSearch(Atom.of(state));
    dispose();
    await (state.components.searchProviders as any).foo.search().catch(m => m);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it('catches any emitted exceptions', async () => {
    console.warn = jest.fn();
    state.search.input = 'test';
    state.components.searchProviders = {
      foo: {
        search() {
          return Promise.reject('ouch!');
        },
        clear() {},
        cancel() {},
      },
    };
    triggerSearch(Atom.of(state));
    await (state.components.searchProviders as any).foo.search().catch(m => m);
    expect(console.warn).toHaveBeenCalled();
  });

  it('registerSearchProvider and unregisterSearchProvider', () => {
    const state = Atom.of({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {},
      },
    });
    registerSearchProvider(state, 'foo', 10);
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {
          foo: 10,
        },
      },
    });
    unregisterSearchProvider(state, 'foo');
    expect(deref(state)).toEqual({
      foo: 5,
      components: {
        foo: 5,
        searchProviders: {},
      },
    });
  });
});
