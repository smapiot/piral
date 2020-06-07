import * as React from 'react';
import { useSearch } from './useSearch';
import { PiralSearchInput } from './components';

export const SearchInput: React.FC = () => {
  const [value, setValue] = useSearch();
  return <PiralSearchInput setValue={setValue} value={value} />;
};
