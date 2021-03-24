import type {} from 'piral-core';
import type { Profile, StateStore } from 'oidc-client';

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
   * The name of the parent frame if the app is placed in an
   * iframe.
   *
   * If undefined or an empty string is provided then no iframe
   * (default behavior) is assumed.
   *
   * Note: This is necessary in order to avoid problems with
   * the silent refresh when being used in an iframe.
   */
  parentName?: string;
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
   * Query params that will be passed to the sign in redirect
   */
  signInRedirectParams?: SignInRedirectParams;
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
  /**
   * If provided, the window will redirect to this Uri after getting
   * a new session from the redirectUri callback.
   */
  appUri?: string;
  /**
   * If provided, logging will be enabled for the oidc-client.
   * Defaults to Log.DEBUG in development NODE_ENV.
   */
  logLevel?: LogLevel;

  /**
   * The store where user information will be placed after authentication succeeds
   * This defaults to oidc-client's WebStorageStateStore, using sessionStorage as the internal store
   */
  userStore?: OidcStore;
}

/**
 * The available log levels.
 */
export enum LogLevel {
  /**
   * Logging disabled.
   */
  none = 'none',
  /**
   * Only log on error.
   */
  error = 'error',
  /**
   * Start logging when its at least a warning.
   */
  warn = 'warn',
  /**
   * Already start logging on info level.
   */
  info = 'info',
  /**
   * Log everything - good for debugging purposes.
   */
  debug = 'debug',
}

/**
 * This interface is used to merge in custom OIDC Claims to the
 * `getProfile()` call. It can be used as follows below.
 *
 * (in this example, `piletApi.getProfile()` will return an object
 * with the default OIDC claims, and also contain `myCustomClaim`):
 *
 * ```
 * //piral-instance/index.tsx
 * import 'piral-oidc';
 *
 * declare module 'piral-oidc/lib/types' {
 *   interface PiralCustomOidcProfile {
 *     myCustomClaim: string;
 *   }
 * }
 * ```
 */
export interface PiralCustomOidcProfile {}

/**
 * The defined OIDC profile.
 */
export type OidcProfile = PiralCustomOidcProfile & Profile;

export interface OidcRequest {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OidcClient {
  /**
   * Performs a login. Will do nothing when called from a non-top window.
   */
  login(): Promise<void>;
  /**
   * Performs a logout.
   */
  logout(): Promise<void>;
  /**
   * Performs a login when the app needs a new token, handles callbacks when on
   * a callback URL, and redirects into the app route if the client was configured with an `appUri`.
   *
   * When this resolves to true, the app-shell should call its `render()` method.
   * When this resolves to false, do not call `render()`.
   *
   * If this rejects, the app-shell should redirect to the login page or handle
   * an authentication failure manually, it is also advised to log this error to a logging service,
   * as no users will be be authorized to enter the application.
   */
  handleAuthentication(): Promise<AuthenticationResult>;
  /**
   * Retrieves the current user profile.
   */
  account(): Promise<OidcProfile>;
  /**
   * Gets a token.
   */
  token(): Promise<string>;
  /**
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OidcRequest): void;
}

export interface PiralOidcApi {
  /**
   * Gets the currently valid access token, if any.
   */
  getAccessToken(): Promise<string | undefined>;

  /**
   * Gets the user's claims from oidc.
   */
  getProfile(): Promise<OidcProfile>;
}

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiralOidcApi {}
}

/**
 * The available error types.
 */
export enum OidcErrorType {
  /**
   * This error was thrown at some point during authentication, by the browser or by oidc-client
   * and we are unable to handle it.
   */
  unknown = 'unknown',
  /**
   * This error happens when the user does not have an access token during Authentication.
   * It is an expected error, and should be handled during `handleAuthentication()` calls.
   * If doing manual authentication, prompt the user to `login()` when receiving it.
   */
  notAuthorized = 'notAuthorized',
  /**
   * This error happens when silent renew fails in the background. It is not expected, and
   * signifies a network error or configuration problem.
   */
  silentRenewFailed = 'silentRenewFailed',
  /**
   * This is an unexpected error that happens when the `token()` call retrieves a User from
   * the user manager, but it does not have an access_token. This signifies a configuration
   * error, make sure the correct `scopes` are supplied during configuration.
   */
  invalidToken = 'invalidToken',
  /**
   * This error happened during an Open ID callback. This signifies a network or configuration error
   * which is non-recoverable. This should be logged to a logging service, and the user should be
   * prompted to logout().
   */
  oidcCallback = 'oidcCallback',
}

/**
 * This Error is used for Authentication errors in piral-oidc.
 */
export interface PiralOidcError extends Error {
  type: Readonly<OidcErrorType>;
}

export interface SignInRedirectParams {
  /**
   * Values used to maintain state between the sign in request and the callback.
   * These will be available on the result from the handleAuthentication function
   * successfully authenticates from a callback state.
   */
  state?: any;
}

/** Result that is returned from the handleAuthentication function */
export interface AuthenticationResult {
  /** Whether or not the application should be rendered */
  shouldRender: boolean;
  /** The request state that is returned from any callbacks.
   * This will only be populated if a callback method is called.
   */
  state?: any;
}

/** An expected interface type for oidc-client to store its user state. */
export interface OidcStore extends StateStore {}
