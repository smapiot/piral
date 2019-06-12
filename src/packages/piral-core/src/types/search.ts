import { ReactNode } from 'react';

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

export interface SearchProvider<TApi> {
  (options: SearchOptions, api: TApi): Promise<Array<ReactNode | HTMLElement>>;
}

export interface SearchHandler {
  (options: SearchOptions): Promise<Array<ReactNode | HTMLElement>>;
}
