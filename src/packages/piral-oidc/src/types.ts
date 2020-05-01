import { Profile } from 'oidc-client';

/**
 * Available configuration options for the OpenID Connect plugin.
 */
export interface OidcConfig {
  /**
   * The id of the client. Required for the setup of OAuth 2.0.
   */
  clientId: string;
  /**
   * The client secret.
   */
  clientSecret?: string;
  /**
   * The Uri pointing to the Identity Provider.
   */
  identityProviderUri: string;
  /**
   * The redirect Uri to use. By default the origin with /auth
   * is used.
   */
  redirectUri?: string;
  /**
   * The Uri to which the Identity provider should redirect
   * after a logout. By default the origin is used.
   */
  postLogoutRedirectUri?: string;
  /**
   * The protocol response type to be used. By default, `id_token`
   * is used.
   */
  responseType?: string;
  /**
   * The scopes to be used. By default, `openid` is used.
   */
  scopes?: Array<string>;
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
}

export type OidcProfileWithCustomClaims<TCustomClaims extends {}> = TCustomClaims & Profile;

export interface OidcRequest {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OidcClient<TCustomClaims extends {} = {}> {
  /**
   * Performs a login.
   */
  login(): void;
  /**
   * Performs a logout.
   */
  logout(): void;
  /**
   * Retrieves the current user profile.
   */
  profile(): Promise<OidcProfileWithCustomClaims<TCustomClaims>>;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OidcRequest): void;
}

export interface PiralOidcApi<TCustomClaims extends {} = {}> {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;

  getProfile(): Promise<OidcProfileWithCustomClaims<TCustomClaims>>;
}

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi<TCustomClaims extends {} = {}> extends PiralOidcApi<TCustomClaims> {}
}