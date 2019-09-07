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
  (options: SearchOptions): Promise<Array<ReactNode | HTMLElement>>;
}
