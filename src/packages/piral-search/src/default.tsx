import * as React from 'react';
import { defaultRender } from 'piral-core';
import { SearchContainerProps, SearchInputProps, SearchResultProps } from './types';

export const DefaultSearchContainer: React.FC<SearchContainerProps> = props => defaultRender(props.children);
export const DefaultSearchResult: React.FC<SearchResultProps> = props => defaultRender(props.children);
export const DefaultSearchInput: React.FC<SearchInputProps> = props => (
  <input onChange={e => props.setValue(e.target.value)} value={props.value} />
);
