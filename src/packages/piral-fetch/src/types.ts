import 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletFetchApi {}
}

export interface FetchOptions {
  /**
   * Sets the HTTP method.
   * @default 'get'
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head';
  /**
   * Sets the body of the request.
   * @default null
   */
  body?: string | Blob | FormData | Array<any> | {} | number;
  /**
   * Sets the headers of the request.
   * @default {}
   */
  headers?: Record<string, string>;
  /**
   * Sets the caching mode of the request.
   */
  cache?: RequestCache;
  /**
   * Sets the CORS mode of the request.
   */
  mode?: RequestMode;
  /**
   * Sets the result mode of the request.
   * @default 'auto'
   */
  result?: 'auto' | 'json' | 'text';
}

export interface FetchResponse<T> {
  /**
   * The body of the response.
   */
  body: T;
  /**
   * The status code of the response.
   */
  code: number;
  /**
   * The status text of the response.
   */
  text: string;
}

export interface PiletFetchApiFetch {
  /**
   * Triggers an actual HTTP/s request.
   * @param path The target of the fetch.
   * @param options The options to be used.
   * @returns The promise waiting for the response to arrive.
   */
  <T = any>(path: string, options?: FetchOptions): Promise<FetchResponse<T>>;
}

export interface PiletFetchApi {
  /**
   * Performs an HTTP fetch operation against the given URL.
   */
  fetch: PiletFetchApiFetch;
}
