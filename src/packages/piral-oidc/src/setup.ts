import { UserManager, Log } from 'oidc-client';

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

export interface OidcRequest {
  /**
   * Sets the headers of the request.
   * @param headers Headers or a promise to headers.
   */
  setHeaders(headers: any): void;
}

export interface OidcClient {
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
   * Extends the headers of the provided request.
   */
  extendHeaders(req: OidcRequest): void;
}

/**
 * Sets up a new client wrapping the oidc-client API.
 * @param config The configuration for the client.
 */
export function setupOidcClient(config: OidcConfig): OidcClient {
  const {
    clientId,
    clientSecret,
    identityProviderUri,
    redirectUri = `${location.origin}/auth`,
    postLogoutRedirectUri = location.origin,
    responseType,
    scopes,
    restrict = false,
  } = config;
  const userManager = new UserManager({
    authority: identityProviderUri,
    redirect_uri: redirectUri,
    silent_redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    response_type: responseType,
    scope: scopes?.join(' '),
  });

  if (process.env.NODE_ENV === 'development') {
    Log.logger = console;
    Log.level = Log.DEBUG;
  }

  userManager.signinRedirectCallback();
  userManager.signinSilentCallback();
  userManager.signoutRedirectCallback();

  const retrieveToken = () => {
    return new Promise<string>((res, rej) => {
      userManager.getUser().then(
        user => {
          if (!user) {
            rej('Not logged in. Please call `login()` to retrieve a token.');
          } else if (user.access_token && user.expires_in > 60) {
            res(user.access_token);
          } else {
            userManager.signinSilent().then(() => retrieveToken().then(res, rej), rej);
          }
        },
        err => rej(err),
      );
    });
  };

  return {
    login() {
      userManager.signinRedirect();
    },
    logout() {
      userManager.signoutRedirect();
    },
    extendHeaders(req) {
      if (!restrict) {
        req.setHeaders(
          retrieveToken().then(
            token => token && { Authorization: `Bearer ${token}` },
            () => undefined,
          ),
        );
      }
    },
    token: retrieveToken,
  };
}
