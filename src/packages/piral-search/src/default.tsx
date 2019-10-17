import * as React from 'react';
import { defaultRender } from 'piral-core';
import { SearchContainerProps, SearchInputProps, SearchResultProps } from './types';

export const DefaultContainer: React.FC<SearchContainerProps> = props => defaultRender(props.children);
export const DefaultResult: React.FC<SearchResultProps> = props => defaultRender(props.children);
export const DefaultInput: React.FC<SearchInputProps> = props => (
  <input onChange={e => props.setValue(e.target.value)} value={props.value} />
);
