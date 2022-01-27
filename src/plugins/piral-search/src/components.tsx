import type { ComponentType } from 'react';
import { getPiralComponent } from 'piral-core';
import { SearchContainerProps, SearchInputProps, SearchResultProps } from './types';

export const PiralSearchContainer: ComponentType<SearchContainerProps> = getPiralComponent('SearchContainer');
export const PiralSearchInput: ComponentType<SearchInputProps> = getPiralComponent('SearchInput');
export const PiralSearchResult: ComponentType<SearchResultProps> = getPiralComponent('SearchResult');
