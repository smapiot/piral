import { Data } from 'client-oauth2';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralOAuth2Api {}
}

export interface PiralOAuth2Api {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;
}

/**
 * The relevant OAuth 2 token information.
 */
export interface OAuth2TokenInfo {
  accessToken: string;
  refreshToken: string;
  data: Data;
}

/**
 * Defines the interface for the OAuth 2 persistence layer.
 */
export interface OAuth2Persistence {
  /**
   * Loads an OAuth 2 token structure.
   */
  load(): OAuth2TokenInfo;
  /**
   * Stores an OAuth 2 token structure.
   * @param info The token infos to store.
   */
  save(info: OAuth2TokenInfo): void;
}
