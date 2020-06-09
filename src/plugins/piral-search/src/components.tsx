import * as React from 'react';
import { getPiralComponent } from 'piral-core';
import { SearchContainerProps, SearchInputProps, SearchResultProps } from './types';

export const PiralSearchContainer: React.ComponentType<SearchContainerProps> = getPiralComponent('SearchContainer');
export const PiralSearchInput: React.ComponentType<SearchInputProps> = getPiralComponent('SearchInput');
export const PiralSearchResult: React.ComponentType<SearchResultProps> = getPiralComponent('SearchResult');
