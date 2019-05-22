import * as React from 'react';
import { useGlobalState, useSearch } from 'piral-core';
import { useTranslation } from '../../hooks';

const SearchLoading: React.SFC = () => (
  <pi-center>
    <pi-spinner />
  </pi-center>
);

const SearchResults: React.SFC = () => {
  const { loading, items } = useGlobalState(m => ({
    loading: m.search.loading,
    items: m.search.results,
  }));
  return (
    <pi-details>
      {items.map((item, i) => (
        <pi-item key={i}>{item}</pi-item>
      ))}
      {loading && <SearchLoading />}
    </pi-details>
  );
};

export const Search: React.SFC = () => {
  const [value, setValue] = useSearch();
  const { searchPlaceholder } = useTranslation();

  return (
    <pi-search>
      <input
        type="search"
        required
        placeholder={searchPlaceholder}
        onChange={e => setValue(e.target.value)}
        value={value}
      />
      <SearchResults />
    </pi-search>
  );
};
