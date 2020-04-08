declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralOidcApi {}
}

export interface PiralOidcApi {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;
}
