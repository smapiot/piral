declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletAdalApi {}
}

export interface PiletAdalApi {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;
}
