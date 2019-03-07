import { useEffect } from 'react';
import { wrapElement } from 'react-arbiter';
import { useDebounce } from './debounce';
import { useGlobalState } from './globalState';
import { useActions } from './actions';

export function useSearch(): [string, (value: string) => void] {
  const { setSearchInput, resetSearchResults, appendSearchResults } = useActions();
  const searchInput = useGlobalState(m => m.search.input);
  const providers = useGlobalState(m => m.components.searchProviders);
  const q = useDebounce(searchInput);

  useEffect(() => {
    const load = !!q;
    resetSearchResults(load);

    if (load) {
      const providerKeys = Object.keys(providers);
      let searchCount = providerKeys.length;
      providerKeys.forEach(key =>
        providers[key].search(q).then(
          results => {
            appendSearchResults(results.map(m => wrapElement(m)), --searchCount === 0);
          },
          ex => {
            console.warn(ex);
            --searchCount === 0 && appendSearchResults([], true);
          },
        ),
      );
    }
  }, [q]);

  return [searchInput, setSearchInput];
}
