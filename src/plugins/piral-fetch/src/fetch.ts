import { FetchConfig, FetchMiddleware } from './config';
import { FetchOptions, FetchResponse, PiletFetchApiFetch } from './types';

const headerAccept = 'accept';
const headerContentType = 'content-type';
const mimeApplicationJson = 'application/json';

export function httpFetch<T>(config: FetchConfig, path: string, options: FetchOptions = {}): Promise<FetchResponse<T>> {
  // fetcher makes the actual HTTP request.
  // It is used as the last step in the upcoming middleware chain and does *not* call/require next
  // (which is undefined in this case).
  const fetcher: FetchMiddleware = (path, options) => {
    const baseInit = config.default || {};
    const baseHeaders = baseInit.headers || {};
    const baseUrl = config.base || location.origin;
    const {
      method = 'get',
      body,
      headers = {},
      cache = baseInit.cache,
      mode = baseInit.mode,
      result = 'auto',
      signal,
    } = options;
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
      signal,
    };

    if (json) {
      init.headers[headerContentType] = 'application/json';
      init.headers[headerAccept] = mimeApplicationJson;
    }

    return fetch(url.href, init).then((res) => {
      const contentType = res.headers.get(headerContentType);
      const json = result === 'json' || (result === 'auto' && !!contentType && contentType.indexOf('json') !== -1);
      const promise = json ? res.json() : res.text();

      return promise.then((body) => ({
        body,
        code: res.status,
        text: res.statusText,
      }));
    });
  };

  // Prepare the middleware chain. Middlewares are called in a top-down order.
  // Every configured middleware function must receive a `next` function with the same shape
  // as a `fetch` function. `next` invokes the next function in the chain.
  // `fetcher` from above is the last function in the chain and always terminates it.
  const middlewareFns = [...(config.middlewares || []), fetcher];
  let middlewareChain: Array<PiletFetchApiFetch>;
  middlewareChain = middlewareFns.map((middleware, i) => {
    const next: PiletFetchApiFetch = (path, options) => middlewareChain[i + 1](path, options);
    const invoke: PiletFetchApiFetch = (path, options) => middleware(path, options, next);
    return invoke;
  });

  return middlewareChain[0](path, options);
}
