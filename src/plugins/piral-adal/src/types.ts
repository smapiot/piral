declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralAdalApi {}
}

export interface PiralAdalApi {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;
}
