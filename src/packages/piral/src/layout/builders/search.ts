import { ComponentType } from 'react';
import { createBuilder } from './createBuilder';
import { createSearch } from '../../components';
import { SearchContainerProps, SearchInputProps, SearchResultProps, SearchBuilder } from '../../types';

export interface SearchBuilderState {
  container: ComponentType<SearchContainerProps>;
  input: ComponentType<SearchInputProps>;
  result: ComponentType<SearchResultProps>;
}

function createInitialState(): SearchBuilderState {
  return {
    container: undefined,
    input: undefined,
    result: undefined,
  };
}

export function searchBuilder(state = createInitialState()): SearchBuilder {
  const initial = {
    build() {
      return createSearch({
        SearchContainer: state.container,
        SearchInput: state.input,
        SearchResult: state.result,
      });
    },
  } as SearchBuilder;
  return createBuilder(initial, state, searchBuilder);
}
