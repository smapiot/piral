import { ReactChild } from 'react';
import { wrapElement } from 'react-arbiter';
import { swap, Atom, deref } from '@dbeining/react-atom';
import { GlobalState, Disposable, SearchOptions } from '../../types';
import { appendItems, prependItems } from '../../utils';

export function setSearchInput(input: string) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      input,
    },
  }));
}

export function triggerSearch(query?: string, immediate = false): Disposable {
  const state = deref(this as Atom<GlobalState>);
  const providers = state.components.searchProviders;
  const { input, loading } = state.search;

  if (query === undefined) {
    query = input;
  }

  if (input !== query || !loading) {
    const allProviders = Object.keys(providers);
    const providerKeys = allProviders.filter(m => !providers[m].onlyImmediate || immediate);
    const load = !!query && providerKeys.length > 0;
    resetSearchResults.call(this, query, load);

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
            active && appendSearchResults.call(this, results.map(m => wrapElement(m)), --searchCount === 0);
          },
          ex => {
            console.warn(ex);
            active && --searchCount === 0 && appendSearchResults.call(this, [], true);
          },
        ),
      );

      return () => {
        active = false;
        providerKeys.forEach(key => providers[key].cancel());
      };
    } else if (!query) {
      allProviders.forEach(key => providers[key].clear());
    }
  }

  return () => {};
}

export function resetSearchResults(input: string, loading: boolean) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      loading,
      input,
      results: [],
    },
  }));
}

export function appendSearchResults(items: Array<ReactChild>, done: boolean) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      loading: !done,
      results: appendItems(state.search.results, items),
    },
  }));
}

export function prependSearchResults(items: Array<ReactChild>, done: boolean) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      loading: !done,
      results: prependItems(state.search.results, items),
    },
  }));
}
