import type { FetchOptions, FetchResponse, PiletFetchApiFetch } from './types';

export interface FetchMiddleware {
  /**
   * A middleware function for the fetch API.
   * @param path The target of the fetch.
   * @param options The options to be used.
   * @param next A function that invokes the next middleware or the final `fetch`.
   * @returns The promise waiting for the response to arrive.
   */
  (path: string, options: FetchOptions, next: PiletFetchApiFetch): Promise<FetchResponse<any>>;
}

export interface FetchConfig {
  /**
   * Sets the default request init settings.
   * @default {}
   */
  default?: RequestInit;
  /**
   * Sets the base URL to use for requests.
   * @default location.origin
   */
  base?: string;
  /**
   * An ordered list of middleware functions which can intercept and transform any request made via `piral-fetch`.
   * Middleware functions are executed in a top-down order for each fetch request.
   * @default []
   */
  middlewares?: Array<FetchMiddleware>;
}
