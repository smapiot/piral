import { PiralGqlApi } from './types';

/**
 * Creates a new Piral GraphQL API extension.
 */
export function createGqlApi(): PiralGqlApi {
  return {
    mutate() {
      return Promise.resolve(undefined);
    },
    query() {
      return Promise.resolve(undefined);
    },
    subscribe() {
      return () => {};
    },
  };
}
