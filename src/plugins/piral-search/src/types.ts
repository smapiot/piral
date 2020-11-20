import { ReactChild, ComponentType, ReactElement } from 'react';
import { Dict, Disposable, PiletApi, BaseRegistration, AnyComponent, BaseComponentProps, RegistrationDisposer } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletSearchApi {}

  interface PiralCustomState {
    /**
     * The relevant state for the in-site search.
     */
    search: SearchState;
  }

  interface PiralCustomActions {
    /**
     * Registers a new search provider.
     * @param name The name of the search provider.
     * @param value The value representing the provider.
     */
    registerSearchProvider(name: string, value: SearchProviderRegistration): void;
    /**
     * Unregisters an existing search provider.
     * @param name The name of the search provider.
     */
    unregisterSearchProvider(name: string): void;
    /**
     * Sets the current search input.
     * @param input The input to set.
     */
    setSearchInput(input: string): void;
    /**
     * Resets the search results.
     * @param input The input to set.
     * @param loading Determines if further results are currently loading.
     */
    resetSearchResults(input: string, loading: boolean): void;
    /**
     * Appends more results to the existing results.
     * @param items The items to append.
     * @param done Determines if more results are pending.
     */
    appendSearchResults(items: Array<ReactChild>, done: boolean): void;
    /**
     * Prepends more results to the existing results.
     * @param items The items to prepend.
     * @param done Determines if more results are pending.
     */
    prependSearchResults(items: Array<ReactChild>, done: boolean): void;
    /**
     * Triggers the search explicitly.
     * @param input Optionally sets the query to look for. Otherwise the current input is taken.
     * @param immediate Optionally, determins if the search was invoked immediately.
     */
    triggerSearch(input?: string, immediate?: boolean): Disposable;
  }

  interface PiralCustomRegistryState {
    /**
     * The registered search providers for context aware search.
     */
    searchProviders: Dict<SearchProviderRegistration>;
  }

  interface PiralCustomComponentsState {
    /**
     * The component for showing the results of the search.
     */
    SearchResult: ComponentType<SearchResultProps>;
    /**
     * The container for showing search.
     */
    SearchContainer: ComponentType<SearchContainerProps>;
    /**
     * The input component for search capability.
     */
    SearchInput: ComponentType<SearchInputProps>;
  }
}

export interface SearchContainerProps {
  /**
   * Gets if the results are still gathered.
   */
  loading: boolean;
}

export interface SearchInputProps {
  setValue(value: string): void;
  value: string;
}

export interface SearchResultComponentProps extends BaseComponentProps {}

export interface SearchResultProps {}

export type SearchResultType = string | ReactElement<any> | AnyComponent<SearchResultComponentProps>;

export interface SearchProvider {
  (options: SearchOptions, api: PiletApi): Promise<SearchResultType | Array<SearchResultType>>;
}

export interface SearchState {
  /**
   * Gets the current input value.
   */
  input: string;
  /**
   * Gets the current result state.
   */
  results: {
    /**
     * Gets weather the search is still loading.
     */
    loading: boolean;
    /**
     * The results to display for the current search.
     */
    items: Array<ReactChild>;
  };
}

export interface SearchOptions {
  /**
   * Gets the query for the search. This is currently available input
   * value.
   */
  query: string;
  /**
   * Gets if the search was requested immediately, e.g., via pressing
   * the enter key.
   */
  immediate: boolean;
}

export interface SearchSettings {
  /**
   * Only invoke the search provider if its an immediate search.
   */
  onlyImmediate?: boolean;
  /**
   * Callback to be fired when the search is cleared.
   */
  onClear?(): void;
  /**
   * Callback to be fired when an existing search is cancelled.
   */
  onCancel?(): void;
}

export interface SearchHandler {
  (options: SearchOptions): Promise<Array<ReactChild>>;
}

export interface SearchWrapper {
  (component: AnyComponent<SearchResultComponentProps>): ComponentType;
}

export interface SearchProviderRegistration extends BaseRegistration {
  search: SearchHandler;
  cancel(): void;
  clear(): void;
  onlyImmediate: boolean;
}

export interface PiletSearchApi {
  /**
   * Registers a search provider to respond to search queries.
   * The name has to be unique within the current pilet.
   * @param name The name of the search provider.
   * @param provider The callback to be used for searching.
   * @param settings The optional settings for the search provider.
   */
  registerSearchProvider(name: string, provider: SearchProvider, settings?: SearchSettings): RegistrationDisposer;
  /**
   * Registers a search provider to respond to search queries.
   * @param provider The callback to be used for searching.
   * @param settings The optional settings for the search provider.
   */
  registerSearchProvider(provider: SearchProvider, settings?: SearchSettings): RegistrationDisposer;
  /**
   * Unregisters a search provider known by the given name.
   * Only previously registered search providers can be unregistered.
   * @param name The name of the search provider to unregister.
   */
  unregisterSearchProvider(name: string): void;
}

/**
 * Configuration for creating the search actions.
 */
export interface SearchActionsConfig {
  /**
   * Determines if the providers are also used for an empty query.
   * @default false
   */
  emptyTrigger?: boolean;
  /**
   * Allows filtering of the search providers to query.
   * @param query The query that should be run.
   * @param providerNames The names of the available search providers.
   * @default undefined
   */
  filter?(query: string, providerNames: Array<string>): Array<string>;
}
