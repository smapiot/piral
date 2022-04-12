import type { Data } from 'client-oauth2';

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
 * Available configuration options for the OAuth 2 plugin.
 */
export interface OAuth2Config {
  /**
   * The id of the client. Required for the setup of OAuth 2.
   */
  clientId: string;
  /**
   * The client secret. Only required for the `code` flow.
   */
  clientSecret?: string;
  /**
   * The Uri pointing to the authorization endpoint of the Identity Provider.
   */
  authorizationUri: string;
  /**
   * The Uri pointing to the access token endpoint of the Identity Provider.
   */
  accessTokenUri?: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * The return path to use in case of the "code" flow. By default the
   * path will be set to "/".
   */
  returnPath?: string;
  /**
   * The scopes to be used.
   */
  scopes?: Array<string>;
  /**
   * The OAuth 2 authorization flow type to be used.
   */
  flow?: 'implicit' | 'code';
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
  /**
   * Optional persistence layer for OAuth 2. By default nothing is stored.
   */
  persist?: OAuth2Persistence;
  /**
   * The optional headers to supply in OAuth 2 requests.
   */
  headers?: Record<string, string | Array<string>>;
  /**
   * The optional query parameters to supply in OAuth 2 requests.
   */
  query?: Record<string, string | Array<string>>;
  /**
   * The optional state parameter to supply in OAuth 2 requests.
   */
  state?: string;
}

export interface OAuth2Request {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OAuth2Client {
  /**
   * The underlying OAuth2 client.
   */
  _: any;
  /**
   * Performs a login.
   */
  login(): void;
  /**
   * Performs a logout.
   */
  logout(): void;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Checks if the user is currently logged in.
   */
  account(): boolean;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OAuth2Request): void;
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
