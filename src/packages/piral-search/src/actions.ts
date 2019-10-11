import { ReactChild } from 'react';
import { wrapElement } from 'react-arbiter';
import { swap, Atom, deref } from '@dbeining/react-atom';
import { GlobalState, Disposable, appendItems, prependItems, withKey, withoutKey } from 'piral-core';
import { SearchOptions, SearchProviderRegistration } from './types';

export function setSearchInput(ctx: Atom<GlobalState>, input: string) {
  swap(ctx, state => ({
    ...state,
    search: {
      ...state.search,
      input,
    },
  }));
}

export function triggerSearch(ctx: Atom<GlobalState>, query?: string, immediate = false): Disposable {
  const state = deref(ctx);
  const providers = state.components.searchProviders;
  const { input, loading } = state.search;

  if (query === undefined) {
    query = input;
  }

  if (input !== query || !loading) {
    const allProviders = Object.keys(providers);
    const providerKeys = allProviders.filter(m => !providers[m].onlyImmediate || immediate);
    const load = !!query && providerKeys.length > 0;
    resetSearchResults(ctx, query, load);

    if (load) {
      let searchCount = providerKeys.length;
      let active = true;
      const opts: SearchOptions = {
        query,
        immediate,
      };

      providerKeys.forEach(key =>
        providers[key].search(opts).then(
          results => {
            active && appendSearchResults(ctx, results.map(m => wrapElement(m)), --searchCount === 0);
          },
          ex => {
            console.warn(ex);
            active && --searchCount === 0 && appendSearchResults(ctx, [], true);
          },
        ),
      );

      return () => {
        active = false;
        providerKeys.forEach(key => providers[key].cancel());
        appendSearchResults(ctx, [], load);
      };
    } else if (!query) {
      allProviders.forEach(key => providers[key].clear());
    }
  }

  return () => {};
}

export function resetSearchResults(ctx: Atom<GlobalState>, input: string, loading: boolean) {
  swap(ctx, state => ({
    ...state,
    search: {
      ...state.search,
      loading,
      input,
      results: [],
    },
  }));
}

export function appendSearchResults(ctx: Atom<GlobalState>, items: Array<ReactChild>, done: boolean) {
  swap(ctx, state => ({
    ...state,
    search: {
      ...state.search,
      loading: !done,
      results: appendItems(state.search.results, items),
    },
  }));
}

export function prependSearchResults(ctx: Atom<GlobalState>, items: Array<ReactChild>, done: boolean) {
  swap(ctx, state => ({
    ...state,
    search: {
      ...state.search,
      loading: !done,
      results: prependItems(state.search.results, items),
    },
  }));
}

export function registerSearchProvider(ctx: Atom<GlobalState>, name: string, value: SearchProviderRegistration) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      searchProviders: withKey(state.components.searchProviders, name, value),
    },
  }));
}

export function unregisterSearchProvider(ctx: Atom<GlobalState>, name: string) {
  swap(ctx, state => ({
    ...state,
    components: {
      ...state.components,
      searchProviders: withoutKey(state.components.searchProviders, name),
    },
  }));
}
