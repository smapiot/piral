import { PiralFetchApi, FetchConfig } from './types';

/**
 * Creates a new Piral Fetch API extension.
 */
export function createFetchApi(config: FetchConfig = {}): PiralFetchApi {
  const baseInit = config.default || {};
  const baseHeaders = baseInit.headers || {};
  const baseUrl = config.base || location.origin;

  return {
    fetch(path, options = {}) {
      const {
        method = 'get',
        body,
        headers = {},
        cache = baseInit.cache,
        mode = baseInit.mode,
        result = 'auto',
      } = options;
      const url = new URL(path, baseUrl);
      const init: RequestInit = {
        ...baseInit,
        method,
        body,
        headers: {
          ...baseHeaders,
          ...headers,
        },
        cache,
        mode,
      };
      return fetch(url.href, init).then(res => {
        const contentType = res.headers.get('content-type');
        const json = result === 'json' || (result === 'auto' && contentType.indexOf('json') !== -1);
        const promise = json ? res.json() : res.text();

        return promise.then(body => ({
          body,
          code: res.status,
          text: res.statusText,
        }));
      });
    },
  };
}
