import { FetchConfig } from './config';
import { FetchOptions, FetchResponse } from './types';

export function httpFetch<T>(config: FetchConfig, path: string, options: FetchOptions = {}): Promise<FetchResponse<T>> {
  const baseInit = config.default || {};
  const baseHeaders = baseInit.headers || {};
  const baseUrl = config.base || location.origin;
  const ct = 'content-type';
  const { method = 'get', body, headers = {}, cache = baseInit.cache, mode = baseInit.mode, result = 'auto' } = options;
  const json =
    Array.isArray(body) ||
    typeof body === 'number' ||
    (typeof body === 'object' && body instanceof FormData === false && body instanceof Blob === false);
  const url = new URL(path, baseUrl);
  const init: RequestInit = {
    ...baseInit,
    method,
    body: json ? JSON.stringify(body) : (body as BodyInit),
    headers: {
      ...baseHeaders,
      ...headers,
    },
    cache,
    mode,
  };

  if (json) {
    init.headers[ct] = 'application/json';
  }

  return fetch(url.href, init).then(res => {
    const contentType = res.headers.get(ct);
    const json = result === 'json' || (result === 'auto' && !!contentType && contentType.indexOf('json') !== -1);
    const promise = json ? res.json() : res.text();

    return promise.then(body => ({
      body,
      code: res.status,
      text: res.statusText,
    }));
  });
}
