import * as React from 'react';
import { useGlobalState, useSearch } from 'piral-core';
import { SearchContainerProps, SearchInputProps, SearchResultProps } from '../types';

export interface SearchCreator {
  SearchContainer: React.ComponentType<SearchContainerProps>;
  SearchInput: React.ComponentType<SearchInputProps>;
  SearchResult: React.ComponentType<SearchResultProps>;
}

export function createSearch({ SearchContainer, SearchInput, SearchResult }: SearchCreator): React.FC {
  return () => {
    const [value, setValue] = useSearch();
    const { loading, items } = useGlobalState(m => ({
      loading: m.search.loading,
      items: m.search.results,
    }));
    const search = <SearchInput setValue={setValue} value={value} />;

    return (
      <SearchContainer input={search} loading={loading}>
        {items.map((item, i) => (
          <SearchResult key={i}>{item}</SearchResult>
        ))}
      </SearchContainer>
    );
  };
}
