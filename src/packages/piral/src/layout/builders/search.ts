import { ComponentType } from 'react';
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
  return {
    container(Component) {
      return searchBuilder({
        ...state,
        container: Component,
      });
    },
    input(Component) {
      return searchBuilder({
        ...state,
        input: Component,
      });
    },
    result(Component) {
      return searchBuilder({
        ...state,
        result: Component,
      });
    },
    build() {
      return createSearch({
        SearchContainer: state.container,
        SearchInput: state.input,
        SearchResult: state.result,
      });
    },
  };
}
