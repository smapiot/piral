import { ReactChild } from 'react';
import { swap, Atom } from '@dbeining/react-atom';
import { GlobalState } from '../../types';
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

export function resetSearchResults(loading: boolean) {
  swap(this as Atom<GlobalState>, state => ({
    ...state,
    search: {
      ...state.search,
      loading,
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
