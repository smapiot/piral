export interface FetchOptions {}

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

export interface PiralFetchApi {
  /**
   * Performs an HTTP fetch operation against the given URL.
   * @param url The target of the fetch.
   * @param options The options to be used.
   */
  fetch<T = any>(url: string, options?: FetchOptions): Promise<FetchResponse<T>>;
}
