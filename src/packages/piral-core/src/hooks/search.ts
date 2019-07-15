import { useEffect, useRef } from 'react';
import { useDebounce } from './debounce';
import { useGlobalState } from './globalState';
import { useActions } from './actions';
import { Disposable } from '../types';

/**
 * Hook that yields the possibility of searching in Piral.
 * Returns the current (live, i.e., non-debounced) input value
 * and the ability to change the input value.
 * Changing the input value uses a debounce function to
 * properly cancel any current search and start a new search.
 * All registered search providers are used and search results
 * will be integrated as they arrive.
 */
export function useSearch(): [string, (value: string) => void] {
  const { setSearchInput, triggerSearch } = useActions<{}>();
  const searchInput = useGlobalState(m => m.search.input);
  const query = useDebounce(searchInput);
  const cancel = useRef<Disposable>(undefined);

  useEffect(() => {
    cancel.current && cancel.current();
    cancel.current = triggerSearch(query, false);
  }, [query]);

  return [searchInput, setSearchInput];
}
