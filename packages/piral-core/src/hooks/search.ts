import { useEffect, useRef } from 'react';
import { wrapElement } from 'react-arbiter';
import { useDebounce } from './debounce';
import { useGlobalState } from './globalState';
import { useActions } from './actions';
import { Disposable } from '../types';

export function useSearch(): [string, (value: string) => void] {
  const { setSearchInput, resetSearchResults, appendSearchResults } = useActions();
  const searchInput = useGlobalState(m => m.search.input);
  const providers = useGlobalState(m => m.components.searchProviders);
  const q = useDebounce(searchInput);
  const cancel = useRef<Disposable>(undefined);

  useEffect(() => {
    const load = !!q;
    cancel.current && cancel.current();
    resetSearchResults(load);

    if (load) {
      const providerKeys = Object.keys(providers);
      let searchCount = providerKeys.length;
      let active = true;
      cancel.current = () => (active = false);
      providerKeys.forEach(key =>
        providers[key].search(q).then(
          results => {
            active && appendSearchResults(results.map(m => wrapElement(m)), --searchCount === 0);
          },
          ex => {
            console.warn(ex);
            active && --searchCount === 0 && appendSearchResults([], true);
          },
        ),
      );
    }
  }, [q]);

  return [searchInput, setSearchInput];
}
