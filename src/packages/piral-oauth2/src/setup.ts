import * as ClientOAuth2 from 'client-oauth2';

/**
 * Available configuration options for the OAuth 2.0 plugin.
 */
export interface OAuth2Config {
  /**
   * The id of the client. Required for the setup of OAuth 2.0.
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
   * The scopes to be used.
   */
  scopes?: Array<string>;
  /**
   * The OAuth 2.0 authorization flow type to be used.
   */
  flow?: 'implicit' | 'code';
  /**
   * Restricts token sharing such that other integrations, e.g., with
   * fetch would need to be done manually.
   * Otherwise, the client is responsive to the `before-fetch` event.
   */
  restrict?: boolean;
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
  extendHeaders(req: OAuth2Request): void;
}

const callbackName = 'oauth2Cb';

/**
 * Sets up a new client wrapping the OAuth 2.0 API.
 * @param config The configuration for the client.
 */
export function setupOAuth2Client(config: OAuth2Config): OAuth2Client {
  const {
    clientId,
    clientSecret,
    authorizationUri,
    accessTokenUri,
    redirectUri = `${location.origin}/auth`,
    scopes = [],
    flow,
    restrict = false,
  } = config;
  const client = new ClientOAuth2({
    clientId,
    clientSecret,
    redirectUri,
    authorizationUri,
    accessTokenUri,
    scopes,
  });
  let currentToken: ClientOAuth2.Token;

  if (flow === 'code') {
    client.code.getToken(location.href).then(
      token => (currentToken = token),
      () => {},
    );

    const retrieveToken = () => {
      if (!currentToken) {
        return Promise.reject('Not logged in. Please call `login()` to retrieve a token.');
      }

      if (!currentToken.expired()) {
        return Promise.resolve(currentToken.accessToken);
      }

      return currentToken.refresh().then(refreshedToken => {
        currentToken = refreshedToken;
        return currentToken.accessToken;
      });
    };

    return {
      login() {
        window.location.href = client.code.getUri();
      },
      logout() {
        currentToken = undefined;
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
  } else {
    client.token.getToken(location.href).then(
      token => {
        const opener = window.opener;
        if (opener && typeof opener[callbackName] === 'function') {
          opener[callbackName](token);
          window.close();
        }
        currentToken = token;
      },
      () => {},
    );

    const retrieveToken = () => {
      if (!currentToken) {
        return Promise.reject('Not logged in. Please call `login()` to retrieve a token.');
      }

      if (!currentToken.expired()) {
        return Promise.resolve(currentToken.accessToken);
      }

      return new Promise<string>(res => {
        window[callbackName] = (token: ClientOAuth2.Token) => {
          currentToken = token;
          res(currentToken.accessToken);
        };
        window.open(client.token.getUri());
      });
    };

    return {
      login() {
        window.location.href = client.token.getUri();
      },
      logout() {
        currentToken = undefined;
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
}
