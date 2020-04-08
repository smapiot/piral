declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralOAuth2Api {}
}

export interface PiralOAuth2Api {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;
}
