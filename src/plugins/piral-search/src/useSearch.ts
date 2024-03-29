import { useEffect, useRef } from 'react';
import { useGlobalState, useActions, Disposable } from 'piral-core';
import { useDebounce } from './useDebounce';

/**
 * Hook that yields the possibility of searching in Piral.
 * Returns the current (live, i.e., non-debounced) input value
 * and the ability to change the input value.
 * Changing the input value uses a debounce function to
 * properly cancel any current search and start a new search.
 * All registered search providers are used and search results
 * will be integrated as they arrive.
 * @param delay The delay [ms] to be used for the debounce.
 */
export function useSearch(delay?: number): [string, (value: string) => void] {
  const { setSearchInput, triggerSearch } = useActions();
  const searchInput = useGlobalState((m) => m.search.input);
  const query = useDebounce(searchInput, delay);
  const cancel = useRef<Disposable>(undefined);

  useEffect(() => {
    cancel.current && cancel.current();
    cancel.current = triggerSearch(query, false);
  }, [query]);

  return [searchInput, setSearchInput];
}
