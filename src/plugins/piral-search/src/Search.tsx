import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralSearchContainer, PiralSearchResult } from './components';

export const Search: React.FC = () => {
  const { loading, items } = useGlobalState((m) => m.search.results);

  return (
    <PiralSearchContainer loading={loading}>
      {items.map((item, i) => (
        <PiralSearchResult key={i}>{item}</PiralSearchResult>
      ))}
    </PiralSearchContainer>
  );
};
