import { Extend } from 'piral-core';
import { httpFetch } from './fetch';
import { PiletFetchApi, FetchConfig } from './types';

/**
 * Creates a new Piral Fetch API extension.
 * @param config The custom fetch configuration, if any.
 */
export function createFetchApi(config: FetchConfig = {}): Extend<PiletFetchApi> {
  return () => ({
    fetch<T>(path, options = {}) {
      return httpFetch<T>(config, path, options);
    },
  });
}
