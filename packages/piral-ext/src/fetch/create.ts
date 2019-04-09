import { PiralFetchApi } from './types';

/**
 * Creates a new Piral Fetch API extension.
 */
export function createFetchApi(): PiralFetchApi {
  return {
    fetch() {
      return Promise.resolve(undefined);
    },
  };
}
